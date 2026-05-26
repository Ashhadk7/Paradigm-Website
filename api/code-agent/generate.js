import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { createPullRequestForPlan, loadEditableRepositoryContext } from '../../server/codeAgent/github.js';
import { createCodePlan } from '../../server/codeAgent/openaiCodeAgent.js';
import { getRequest, getServiceClient, requireCmsAdmin, updateRequest } from '../../server/codeAgent/supabaseAdmin.js';

export const maxDuration = 60;

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['POST'])) return;
  let task;
  try {
    await requireCmsAdmin(request);
    const { taskId } = readBody(request);
    assert(taskId, 'A code-change request is required.');
    task = await getRequest(taskId);
    assert(['requested', 'generation_failed'].includes(task.status), 'This request is not waiting for generation approval.', 409);

    const service = getServiceClient();
    const { data: claimed, error: claimError } = await service
      .from('cms_code_change_requests')
      .update({ status: 'generating', error_message: null, updated_at: new Date().toISOString() })
      .eq('id', task.id)
      .in('status', ['requested', 'generation_failed'])
      .select('id')
      .maybeSingle();
    if (claimError) throw claimError;
    assert(claimed, 'Another generation request is already running.', 409);
    const context = await loadEditableRepositoryContext();
    const plan = await createCodePlan(task.prompt, context.files);
    const pull = await createPullRequestForPlan(task.id, task.prompt, plan.summary, plan.changes, context);
    const updated = await updateRequest(task.id, {
      status: 'preview_ready',
      summary: plan.summary,
      branch_name: pull.branch,
      pull_request_number: pull.pullRequestNumber,
      pull_request_url: pull.pullRequestUrl,
      base_sha: pull.baseSha,
      head_sha: pull.headSha,
      changed_files: pull.changedFiles,
    });
    sendJson(response, 200, { task: updated });
  } catch (error) {
    if (task?.id) {
      await updateRequest(task.id, { status: 'generation_failed', error_message: error.message }).catch(() => {});
    }
    apiError(response, error);
  }
}
