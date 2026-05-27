import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { getRequest, requireCmsAdmin, updateRequest } from '../../server/codeAgent/supabaseAdmin.js';

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['POST'])) return;
  try {
    await requireCmsAdmin(request);
    const { taskId } = readBody(request);
    const task = await getRequest(taskId);
    assert(task.status === 'paused', 'This request is not paused.', 409);
    const restoredStatus = task.paused_from_status || 'requested';
    const nextStatus = restoredStatus === 'paused' ? 'requested' : restoredStatus;
    const updated = await updateRequest(task.id, {
      status: nextStatus,
      paused_from_status: null,
      error_message: null,
    });
    sendJson(response, 200, { task: updated });
  } catch (error) {
    apiError(response, error);
  }
}
