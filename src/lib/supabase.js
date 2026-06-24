import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// When Supabase isn't configured (e.g. a static host build with no env), fall
// back to a stub so module load never throws and pages render their default
// copy. The real client is used whenever both env vars are present.
function createStubClient() {
  const result = Promise.resolve({ data: null, error: new Error('Supabase not configured') });
  const builder = {
    select: () => builder,
    eq: () => builder,
    single: () => result,
    then: (...args) => result.then(...args),
  };
  return { from: () => builder };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createStubClient();
