import { createClient } from '@supabase/supabase-js';
import { assert } from './http.js';

function getUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
}

function getAnonKey() {
  return process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
}

export function getServiceClient() {
  assert(getUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY, 'Server database configuration is missing.', 503);
  return createClient(getUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function requireCmsAdmin(request) {
  const header = request.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  assert(token, 'Administrator sign-in is required.', 401);
  assert(getUrl() && getAnonKey(), 'Server authentication configuration is missing.', 503);

  const authClient = createClient(getUrl(), getAnonKey(), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  assert(!userError && userData.user, 'Your administrator session has expired.', 401);

  const { data: isAdmin, error: adminError } = await authClient.rpc('is_cms_admin');
  assert(!adminError && isAdmin, 'CMS administrator permission is required.', 403);
  return userData.user;
}

export async function updateRequest(id, values) {
  const service = getServiceClient();
  const { data, error } = await service
    .from('cms_code_change_requests')
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRequest(id) {
  const service = getServiceClient();
  const { data, error } = await service
    .from('cms_code_change_requests')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
