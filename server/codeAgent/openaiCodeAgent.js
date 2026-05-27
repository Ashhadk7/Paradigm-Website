import { assert } from './http.js';
import { isEditableWebsitePath } from './github.js';

const PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'changes'],
  properties: {
    summary: { type: 'string' },
    changes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['path', 'content', 'reason'],
        properties: {
          path: { type: 'string' },
          content: { type: 'string' },
          reason: { type: 'string' },
        },
      },
    },
  },
};

function extractText(response) {
  if (response.output_text) return response.output_text;
  return response.output
    ?.flatMap(output => output.content || [])
    .map(content => content.text || '')
    .join('') || '';
}

function clampText(value, maxLength) {
  const compact = String(value || '').replace(/\s+/g, ' ').trim();
  if (!compact) return '';
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 1).trimEnd()}…` : compact;
}

function summarizePrompt(prompt, changes) {
  const source = clampText(prompt, 180) || 'requested website updates';
  const firstChange = changes?.[0]?.reason ? clampText(changes[0].reason, 70) : '';
  const summary = firstChange
    ? `Update ${source}: ${firstChange}`
    : `Update ${source}`;
  return clampText(summary, 240);
}

export async function createCodePlan(prompt, files) {
  assert(process.env.OPENAI_API_KEY, 'OpenAI server configuration is missing.', 503);
  const repositoryContext = files
    .map(file => `FILE: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``)
    .join('\n\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CODE_MODEL || 'gpt-5.4',
      input: [
        {
          role: 'developer',
          content: [{
            type: 'input_text',
            text: [
              'You are a careful frontend coding agent for a Vite React website.',
              'Return complete replacement contents only for files that require changes.',
              'You may update public website UI under src excluding src/pages/admin and src/lib, or safe text assets under public.',
              'Never modify API routes, authentication, admin controls, database, CI, package files, environment files, or secrets.',
              'Preserve existing coding style and imports. Keep changes narrowly scoped to the administrator request.',
              'Do not include markdown in file content. Do not invent image binary files.',
            ].join(' '),
          }],
        },
        {
          role: 'user',
          content: [{
            type: 'input_text',
            text: `Administrator request:\n${prompt}\n\nEditable repository context:\n${repositoryContext}`,
          }],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'website_code_change_plan',
          strict: true,
          schema: PLAN_SCHEMA,
        },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error?.message || 'OpenAI could not generate a code proposal.');
    error.statusCode = 502;
    throw error;
  }

  let plan;
  try {
    plan = JSON.parse(extractText(data));
  } catch {
    const error = new Error('OpenAI returned an unreadable code proposal.');
    error.statusCode = 502;
    throw error;
  }

  assert(plan.changes?.length, 'OpenAI did not propose any file updates.', 422);
  assert(plan.changes.length <= 10, 'OpenAI proposed too many file updates.', 422);
  const paths = new Set();
  for (const change of plan.changes) {
    assert(isEditableWebsitePath(change.path), `Proposed file is outside the editable website surface: ${change.path}`, 422);
    assert(!paths.has(change.path), `Proposed file is duplicated: ${change.path}`, 422);
    assert(change.content.length <= 250000, `Proposed file is too large: ${change.path}`, 422);
    assert(typeof change.reason === 'string' && change.reason.trim().length >= 5 && change.reason.length <= 240, `Proposed reason is invalid: ${change.path}`, 422);
    paths.add(change.path);
  }
  const summary = clampText(plan.summary, 240) || summarizePrompt(prompt, plan.changes);
  assert(summary.length >= 10, 'OpenAI returned an invalid proposal summary.', 422);
  plan.summary = summary;
  return plan;
}
