import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { closePullRequest } from '../../server/codeAgent/github.js';
import { getRequest, requireCmsAdmin, updateRequest } from '../../server/codeAgent/supabaseAdmin.js';

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['POST'])) return;
  try {
    await requireCmsAdmin(request);
    const { taskId } = readBody(request);
    const task = await getRequest(taskId);
    assert(!['generating', 'merged', 'reverted', 'merging', 'reverting'].includes(task.status), 'This request can no longer be rejected.', 409);
    if (task.pull_request_number) await closePullRequest(task.pull_request_number);
    if (task.revert_pull_request_number) await closePullRequest(task.revert_pull_request_number);
    const updated = await updateRequest(task.id, { status: 'rejected' });
    sendJson(response, 200, { task: updated });
  } catch (error) {
    apiError(response, error);
  }
}
