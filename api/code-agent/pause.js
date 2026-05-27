import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { getRequest, requireCmsAdmin, updateRequest } from '../../server/codeAgent/supabaseAdmin.js';

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['POST'])) return;
  try {
    await requireCmsAdmin(request);
    const { taskId } = readBody(request);
    const task = await getRequest(taskId);
    assert(task.status !== 'paused', 'This request is already paused.', 409);
    assert(!['generating', 'merging', 'reverting', 'merged', 'reverted', 'rejected'].includes(task.status), 'This request can no longer be paused.', 409);
    const updated = await updateRequest(task.id, {
      status: 'paused',
      paused_from_status: task.status,
      error_message: null,
    });
    sendJson(response, 200, { task: updated });
  } catch (error) {
    apiError(response, error);
  }
}
