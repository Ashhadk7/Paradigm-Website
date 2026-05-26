import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { loadChecks, mergePullRequest } from '../../server/codeAgent/github.js';
import { getRequest, requireCmsAdmin, updateRequest } from '../../server/codeAgent/supabaseAdmin.js';

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['POST'])) return;
  try {
    await requireCmsAdmin(request);
    const { taskId, revert = false } = readBody(request);
    const task = await getRequest(taskId);
    const expectedStatus = revert ? 'revert_ready' : 'merge_ready';
    assert(task.status === expectedStatus, 'Checks must pass before administrator merge approval.', 409);
    const headSha = revert ? task.revert_head_sha : task.head_sha;
    const pullNumber = revert ? task.revert_pull_request_number : task.pull_request_number;
    const verification = await loadChecks(headSha);
    assert(verification.ready, 'Build and Vercel preview checks must pass before merge.', 409);
    await updateRequest(task.id, { status: revert ? 'reverting' : 'merging' });
    const merge = await mergePullRequest(
      pullNumber,
      revert ? `Revert CMS agent change: ${task.summary}` : `CMS agent change: ${task.summary}`,
    );
    assert(merge.merged, merge.message || 'GitHub did not merge the pull request.', 409);
    const updated = await updateRequest(task.id, revert
      ? { status: 'reverted', revert_merge_sha: merge.sha }
      : { status: 'merged', merge_sha: merge.sha });
    sendJson(response, 200, { task: updated });
  } catch (error) {
    apiError(response, error);
  }
}
