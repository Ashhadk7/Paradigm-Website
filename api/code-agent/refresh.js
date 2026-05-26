import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { loadChecks } from '../../server/codeAgent/github.js';
import { getRequest, requireCmsAdmin, updateRequest } from '../../server/codeAgent/supabaseAdmin.js';

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['POST'])) return;
  try {
    await requireCmsAdmin(request);
    const { taskId } = readBody(request);
    const task = await getRequest(taskId);
    const reverting = ['revert_preview_ready', 'revert_ready'].includes(task.status);
    const sha = reverting ? task.revert_head_sha : task.head_sha;
    assert(sha, 'This request has no generated branch to inspect.', 409);
    const result = await loadChecks(sha);
    const status = result.ready
      ? (reverting ? 'revert_ready' : 'merge_ready')
      : (reverting ? 'revert_preview_ready' : 'preview_ready');
    const updated = await updateRequest(task.id, {
      status,
      checks: result.checks,
      preview_url: result.previewUrl || task.preview_url,
    });
    sendJson(response, 200, { task: updated });
  } catch (error) {
    apiError(response, error);
  }
}
