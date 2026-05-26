# OpenAI Integration For The CMS Assistant

The browser must not call OpenAI directly. A `VITE_*` variable is embedded in
the client bundle, so an OpenAI API key must be stored as a server-side
Supabase Edge Function secret.

## Recommended Flow

1. `AgentPanel` sends the authenticated user's prompt, active page, current
   content and current presentation settings to a Supabase Edge Function.
2. The function validates the Supabase JWT and calls `is_cms_admin()`.
3. The function calls the OpenAI Responses API using `OPENAI_API_KEY`.
4. The model must return a structured proposal, never executable JSX or CSS:

```json
{
  "summary": "Tighten the homepage hero.",
  "operations": [
    {
      "type": "presentation.update",
      "path": "hero_density",
      "value": "compact",
      "reason": "Reduce hero vertical whitespace."
    },
    {
      "type": "content.update",
      "path": "hero_headline",
      "value": "A clearer investment perspective.",
      "reason": "Replace the approved CMS headline field."
    }
  ]
}
```

5. The Edge Function validates presentation operations against
   `presentationSchema.js` and content operations against the editable fields
   configured for the selected CMS page.
6. The browser displays the proposal. Existing approval and rollback controls
   continue to own publication.

## Setup

Create the secret in Supabase:

```bash
supabase secrets set OPENAI_API_KEY=your_key OPENAI_MODEL=gpt-5.4
```

Create an Edge Function such as:

```text
supabase/functions/cms-agent-propose/index.ts
```

Server-side request shape for the Supabase Edge Function runtime:

```ts
import OpenAI from 'npm:openai';

const client = new OpenAI({
  apiKey: Deno.env.get('OPENAI_API_KEY'),
});

const response = await client.responses.create({
  model: Deno.env.get('OPENAI_MODEL') || 'gpt-5.4',
  input: [
    {
      role: 'developer',
      content: [{
        type: 'input_text',
        text: 'Return only approved CMS content or presentation operations. Never return code or arbitrary CSS.',
      }],
    },
    {
      role: 'user',
      content: [{ type: 'input_text', text: prompt }],
    },
  ],
  text: {
    format: {
      type: 'json_schema',
      name: 'cms_proposal',
      strict: true,
      schema: proposalSchema,
    },
  },
});
```

From the browser, replace the local proposal builder with an authenticated
function call and continue to present its result for approval:

```js
const { data: proposal, error } = await supabase.functions.invoke(
  'cms-agent-propose',
  {
    body: { prompt, pageKey: activePage, content, presentation, allowedFields },
  },
);
```

The quickstart currently uses `gpt-5.4` with the Responses API. For
production, evaluate the selected model and use a pinned snapshot where
stable proposal behavior is required.

## Security Rules

- Never add `VITE_OPENAI_API_KEY`.
- Never let model output directly update Supabase.
- Never allow arbitrary property names, HTML, JSX, CSS or JavaScript in a CMS
  operation.
- Store prompt/proposal/application history in `cms_agent_sessions` and
  `cms_agent_stages`.
- Keep approval and rollback server-authorized through Supabase.

## Source-Code Editing Mode

Editing React structure, arbitrary CSS, or adding components is not the same
operation as publishing CMS data. A Codex-style mode must run in a trusted
backend worker connected to a repository, not in the visitor browser:

1. The admin submits a development request from the CMS.
2. A backend worker creates a Git branch and asks an agent to generate a patch.
3. The worker applies the patch in an isolated checkout, runs lint and build,
   and deploys a preview URL.
4. The admin reviews the preview and approves a pull request.
5. Production changes only after CI and merge; rollback is a Git revert.

Use this mode for structural navbar/footer redesigns, component additions, or
free-form theme refactors. Keep ordinary copy and approved style token edits
in the immediate Supabase publish flow implemented by the CMS assistant.

## Official References

- OpenAI API quickstart: https://developers.openai.com/api/docs/quickstart
- Responses API / text generation: https://developers.openai.com/api/docs/guides/text
- Function calling: https://developers.openai.com/api/docs/guides/function-calling
- Structured outputs: https://developers.openai.com/api/docs/guides/structured-outputs
