import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Whether Supabase is actually configured for this environment.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Don't crash the whole app (white screen) when env vars are missing — e.g. a
  // fresh checkout with no .env, or a preview deploy before keys are wired.
  // Public pages already fall back to their default copy; the admin shows a
  // configuration notice instead of failing to mount.
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set. ' +
    'Content editing and admin are disabled until they are configured (see .env.example).'
  );
}

// When unconfigured, expose a stub whose methods reject/return empty rather than
// throwing at import time. createClient() throws if the URL is missing, so we
// only construct the real client when configured.
function createStub() {
  const noData = async () => ({ data: null, error: new Error('Supabase is not configured') });
  const query = {
    select: () => query,
    eq: () => query,
    order: () => query,
    limit: () => query,
    single: noData,
    maybeSingle: noData,
    then: (resolve) => resolve({ data: null, error: new Error('Supabase is not configured') }),
  };
  return {
    from: () => query,
    rpc: noData,
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: noData,
      signOut: async () => ({ error: null }),
    },
    storage: { from: () => ({ upload: noData, getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createStub();
