import { allowMethods, apiError, assert, readBody, sendJson } from '../../server/codeAgent/http.js';
import { getServiceClient, requireCmsAdmin } from '../../server/codeAgent/supabaseAdmin.js';

export default async function handler(request, response) {
  if (!allowMethods(request, response, ['GET', 'POST'])) return;
  try {
    const user = await requireCmsAdmin(request);
    const service = getServiceClient();

    if (request.method === 'GET') {
      const { data, error } = await service
        .from('cms_code_change_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      sendJson(response, 200, { tasks: data || [] });
      return;
    }

    const { prompt } = readBody(request);
    assert(typeof prompt === 'string' && prompt.trim().length >= 10, 'Describe the requested change in at least 10 characters.');
    assert(prompt.trim().length <= 4000, 'The request is too long.');
    const { data, error } = await service
      .from('cms_code_change_requests')
      .insert({ requested_by: user.id, prompt: prompt.trim() })
      .select()
      .single();
    if (error) throw error;
    sendJson(response, 201, { task: data });
  } catch (error) {
    apiError(response, error);
  }
}
