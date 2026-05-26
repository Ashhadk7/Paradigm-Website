import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { createRevertPullRequest } from '../../server/codeAgent/github.js';
import { getRequest, requireCmsAdmin, updateRequest } from '../../server/codeAgent/supabaseAdmin.js';

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['POST'])) return;
  try {
    await requireCmsAdmin(request);
    const { taskId } = readBody(request);
    const task = await getRequest(taskId);
    assert(task.status === 'merged', 'Only a merged request can be reverted.', 409);
    assert(task.changed_files?.length, 'No changed files were recorded for rollback.', 409);
    const pull = await createRevertPullRequest(task);
    const updated = await updateRequest(task.id, {
      status: 'revert_preview_ready',
      revert_branch_name: pull.branch,
      revert_pull_request_number: pull.pullRequestNumber,
      revert_pull_request_url: pull.pullRequestUrl,
      revert_head_sha: pull.headSha,
      checks: [],
      preview_url: null,
    });
    sendJson(response, 200, { task: updated });
  } catch (error) {
    apiError(response, error);
  }
}
