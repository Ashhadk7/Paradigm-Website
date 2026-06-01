import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(!isSupabaseConfigured ? false : true);
  const [notice, setNotice] = useState(
    isSupabaseConfigured ? '' : 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example), then restart the dev server.'
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;

    async function validateSession(nextSession) {
      if (!active) return;

      if (!nextSession) {
        setSession(null);
        setAuthorized(false);
        setChecking(false);
        return;
      }

      setChecking(true);
      const { data: isAdmin, error } = await supabase.rpc('is_cms_admin');

      if (!active) return;

      if (error || !isAdmin) {
        setAuthorized(false);
        setNotice(error
          ? 'CMS authorization is not configured. Apply the latest Supabase migration.'
          : 'This account is not authorized for CMS administration.');
        await supabase.auth.signOut();
        setChecking(false);
        return;
      }

      setSession(nextSession);
      setAuthorized(true);
      setNotice('');
      setChecking(false);
    }

    supabase.auth.getSession().then(({ data: { session: nextSession } }) => {
      validateSession(nextSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      validateSession(nextSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (checking) return null;

  if (!session || !authorized) {
    return <AdminLogin notice={notice} onLogin={() => setNotice('')} />;
  }

  return <AdminDashboard onLogout={() => setSession(null)} />;
}
