import crypto from 'node:crypto';
import { assert } from './http.js';

const OWNER = process.env.GITHUB_OWNER || 'Ashhadk7';
const REPOSITORY = process.env.GITHUB_REPO || 'Paradigm-Website';
const BASE_BRANCH = process.env.GITHUB_BASE_BRANCH || 'main';
const API_VERSION = process.env.GITHUB_API_VERSION || '2022-11-28';

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function createAppJwt() {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replaceAll('\\n', '\n');
  assert(appId && privateKey, 'GitHub App configuration is missing.', 503);

  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iat: now - 60,
    exp: now + 540,
    iss: appId,
  })}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), privateKey).toString('base64url');
  return `${unsigned}.${signature}`;
}

async function requestGitHub(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': API_VERSION,
      'User-Agent': 'paradigm-cms-code-agent',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) {
    const error = new Error(data?.message || 'GitHub API request failed.');
    error.statusCode = response.status >= 500 ? 502 : response.status;
    throw error;
  }
  return data;
}

async function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  assert(installationId, 'GitHub App installation configuration is missing.', 503);
  const installation = await requestGitHub(`/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    token: createAppJwt(),
  });
  return installation.token;
}

function repoPath(path) {
  return `/repos/${OWNER}/${REPOSITORY}${path}`;
}

export function isEditableWebsitePath(path) {
  if (path.startsWith('src/pages/admin/') || path.startsWith('src/lib/')) return false;
  if (/^src\/.*\.(jsx?|css)$/.test(path)) return true;
  if (/^public\/.*\.(svg|txt|json|css)$/.test(path)) return true;
  return ['index.html', 'tailwind.config.js', 'postcss.config.js'].includes(path);
}

async function getBranchHead(token, branch = BASE_BRANCH) {
  const reference = await requestGitHub(repoPath(`/git/ref/heads/${branch}`), { token });
  const commit = await requestGitHub(repoPath(`/git/commits/${reference.object.sha}`), { token });
  return { sha: reference.object.sha, treeSha: commit.tree.sha };
}

async function getTree(token, treeSha) {
  return requestGitHub(repoPath(`/git/trees/${treeSha}?recursive=1`), { token });
}

async function getBlobText(token, sha) {
  const blob = await requestGitHub(repoPath(`/git/blobs/${sha}`), { token });
  return Buffer.from(blob.content, 'base64').toString('utf8');
}

export async function loadEditableRepositoryContext() {
  const token = await getToken();
  const base = await getBranchHead(token);
  const tree = await getTree(token, base.treeSha);
  let total = 0;
  const files = [];

  for (const entry of tree.tree.filter(item => item.type === 'blob' && isEditableWebsitePath(item.path))) {
    if (files.length >= 60 || total >= 180000) break;
    const content = await getBlobText(token, entry.sha);
    if (total + content.length > 180000) continue;
    total += content.length;
    files.push({ path: entry.path, sha: entry.sha, content });
  }

  return { token, base, files };
}

export async function createPullRequestForPlan(taskId, prompt, summary, changes, context) {
  const { token, base } = context;
  const branch = `agent/${taskId.slice(0, 8)}-${Date.now()}`;
  await requestGitHub(repoPath('/git/refs'), {
    method: 'POST',
    token,
    body: { ref: `refs/heads/${branch}`, sha: base.sha },
  });

  const originalByPath = new Map(context.files.map(file => [file.path, file]));
  const entries = [];
  const changedFiles = [];
  for (const change of changes) {
    const original = originalByPath.get(change.path);
    const blob = await requestGitHub(repoPath('/git/blobs'), {
      method: 'POST',
      token,
      body: { content: change.content, encoding: 'utf-8' },
    });
    entries.push({ path: change.path, mode: '100644', type: 'blob', sha: blob.sha });
    changedFiles.push({
      path: change.path,
      originalSha: original?.sha || null,
      generatedSha: blob.sha,
      reason: change.reason,
    });
  }

  const tree = await requestGitHub(repoPath('/git/trees'), {
    method: 'POST',
    token,
    body: { base_tree: base.treeSha, tree: entries },
  });
  const commit = await requestGitHub(repoPath('/git/commits'), {
    method: 'POST',
    token,
    body: {
      message: `Agent proposal: ${summary.slice(0, 70)}`,
      tree: tree.sha,
      parents: [base.sha],
    },
  });
  await requestGitHub(repoPath(`/git/refs/heads/${branch}`), {
    method: 'PATCH',
    token,
    body: { sha: commit.sha, force: false },
  });

  const pull = await requestGitHub(repoPath('/pulls'), {
    method: 'POST',
    token,
    body: {
      title: `[CMS Agent] ${summary.slice(0, 80)}`,
      head: branch,
      base: BASE_BRANCH,
      body: [
        '## CMS Code Agent Proposal',
        '',
        summary,
        '',
        '### Administrator Request',
        prompt,
        '',
        '### Controls',
        '- Generated from the admin CMS after explicit approval.',
        '- Production is unchanged until this pull request is reviewed and merged.',
        '- Automated lint/build and a deployment preview must pass before CMS merge approval.',
      ].join('\n'),
    },
  });

  return {
    branch,
    pullRequestNumber: pull.number,
    pullRequestUrl: pull.html_url,
    baseSha: base.sha,
    headSha: commit.sha,
    changedFiles,
  };
}

export async function loadChecks(headSha) {
  const token = await getToken();
  const [response, combinedStatus] = await Promise.all([
    requestGitHub(repoPath(`/commits/${headSha}/check-runs?per_page=100`), { token }),
    requestGitHub(repoPath(`/commits/${headSha}/status`), { token }),
  ]);
  const checks = response.check_runs.map(check => ({
    name: check.name,
    status: check.status,
    conclusion: check.conclusion,
    url: check.details_url,
  }));
  const statuses = combinedStatus.statuses.map(status => ({
    name: status.context,
    status: status.state === 'pending' ? 'in_progress' : 'completed',
    conclusion: status.state === 'success' ? 'success' : status.state === 'pending' ? null : 'failure',
    url: status.target_url,
  }));
  const allChecks = [...checks, ...statuses];
  const validation = checks.find(check => check.name.toLowerCase().includes('build and lint'));
  const deployment = allChecks.find(check => /vercel/i.test(check.name));
  const failed = allChecks.some(check => ['failure', 'cancelled', 'timed_out', 'action_required'].includes(check.conclusion));
  const ready = Boolean(validation?.conclusion === 'success' && deployment?.conclusion === 'success' && !failed);
  return { checks: allChecks, ready, previewUrl: deployment?.url || null };
}

export async function mergePullRequest(number, title) {
  const token = await getToken();
  return requestGitHub(repoPath(`/pulls/${number}/merge`), {
    method: 'PUT',
    token,
    body: { merge_method: 'squash', commit_title: title },
  });
}

export async function closePullRequest(number) {
  const token = await getToken();
  return requestGitHub(repoPath(`/pulls/${number}`), {
    method: 'PATCH',
    token,
    body: { state: 'closed' },
  });
}

export async function createRevertPullRequest(task) {
  const token = await getToken();
  const current = await getBranchHead(token);
  assert(
    current.sha === task.merge_sha,
    'Rollback is blocked because main has newer changes. Create a reviewed manual rollback for the affected files instead.',
    409,
  );
  const branch = `agent/revert-${task.id.slice(0, 8)}-${Date.now()}`;
  await requestGitHub(repoPath('/git/refs'), {
    method: 'POST',
    token,
    body: { ref: `refs/heads/${branch}`, sha: current.sha },
  });

  const entries = task.changed_files.map(file => ({
    path: file.path,
    mode: '100644',
    type: 'blob',
    sha: file.originalSha,
  }));
  const tree = await requestGitHub(repoPath('/git/trees'), {
    method: 'POST',
    token,
    body: { base_tree: current.treeSha, tree: entries },
  });
  const commit = await requestGitHub(repoPath('/git/commits'), {
    method: 'POST',
    token,
    body: {
      message: `Revert CMS agent change: ${task.summary || task.prompt.slice(0, 60)}`,
      tree: tree.sha,
      parents: [current.sha],
    },
  });
  await requestGitHub(repoPath(`/git/refs/heads/${branch}`), {
    method: 'PATCH',
    token,
    body: { sha: commit.sha, force: false },
  });
  const pull = await requestGitHub(repoPath('/pulls'), {
    method: 'POST',
    token,
    body: {
      title: `[CMS Agent Revert] ${(task.summary || task.prompt).slice(0, 70)}`,
      head: branch,
      base: BASE_BRANCH,
      body: 'Restores the files changed by the approved CMS code-agent request. This rollback also requires successful checks and administrator approval before merge.',
    },
  });
  return { branch, headSha: commit.sha, pullRequestNumber: pull.number, pullRequestUrl: pull.html_url };
}
