import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { publishContentUpdate } from './useContent';
import { withFieldStyle, STYLES_KEY } from './elementStyles';
import { EditModeContext } from './editModeContext';

// Visual edit-mode state for the WordPress-like click-to-edit editor.
//
// Holds a working copy of the active page's content (including the reserved
// `_styles` overrides), broadcasts edits live via publishContentUpdate (the same
// pipeline the public pages already listen to), and persists with the existing
// `save_page_content` RPC. Access is gated by the same `is_cms_admin()` check the
// /admin route uses.

export function EditModeProvider({ children }) {
  const [editing, setEditing] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Active page being edited and its working content (incl. _styles).
  const [pageKey, setPageKey] = useState(null);
  const [draft, setDraft] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  // Baseline to support discard.
  const baselineRef = useRef(null);

  // Confirm the signed-in user is a CMS admin before enabling editing.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          if (!cancelled) { setAuthorized(false); setCheckingAuth(false); }
          return;
        }
        const { data, error } = await supabase.rpc('is_cms_admin');
        if (!cancelled) {
          setAuthorized(!error && data === true);
          setCheckingAuth(false);
        }
      } catch {
        if (!cancelled) { setAuthorized(false); setCheckingAuth(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // A page registers itself when it mounts under edit mode so the provider knows
  // which content to edit and can seed the draft from what's currently rendered.
  const registerPage = useCallback((key, currentContent) => {
    setPageKey(key);
    setDraft((prev) => {
      // Don't clobber an in-progress draft for the same page.
      if (prev && baselineRef.current?.key === key) return prev;
      const seed = { ...(currentContent || {}) };
      baselineRef.current = { key, content: JSON.parse(JSON.stringify(seed)) };
      setDirty(false);
      return seed;
    });
  }, []);

  const broadcast = useCallback((key, content) => {
    // Live preview: push into the shared cache + fire the content-updated event
    // that useContent() on the page is already subscribed to.
    publishContentUpdate(key, content);
  }, []);

  const setFieldText = useCallback((field, text) => {
    setDraft((prev) => {
      const next = { ...prev, [field]: text };
      broadcast(pageKey, next);
      return next;
    });
    setDirty(true);
  }, [pageKey, broadcast]);

  const setFieldStyle = useCallback((field, partial) => {
    setDraft((prev) => {
      const next = withFieldStyle(prev, field, partial);
      broadcast(pageKey, next);
      return next;
    });
    setDirty(true);
  }, [pageKey, broadcast]);

  const toggleHidden = useCallback((field) => {
    setDraft((prev) => {
      const currentlyHidden = prev?.[STYLES_KEY]?.[field]?.hidden === true;
      const next = withFieldStyle(prev, field, { hidden: !currentlyHidden });
      broadcast(pageKey, next);
      return next;
    });
    setDirty(true);
  }, [pageKey, broadcast]);

  const discard = useCallback(() => {
    const base = baselineRef.current;
    if (!base) return;
    const restored = JSON.parse(JSON.stringify(base.content));
    setDraft(restored);
    broadcast(base.key, restored);
    setDirty(false);
    setSelectedField(null);
  }, [broadcast]);

  const save = useCallback(async () => {
    if (!pageKey || !draft) return { ok: false };
    setSaving(true);
    try {
      const { error } = await supabase.rpc('save_page_content', {
        p_page_key: pageKey,
        p_content: draft,
      });
      if (error) throw error;
      baselineRef.current = { key: pageKey, content: JSON.parse(JSON.stringify(draft)) };
      broadcast(pageKey, draft);
      setDirty(false);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err };
    } finally {
      setSaving(false);
    }
  }, [pageKey, draft, broadcast]);

  const exitEditing = useCallback(() => {
    setEditing(false);
    setSelectedField(null);
  }, []);

  const value = {
    editing, setEditing, exitEditing,
    authorized, checkingAuth,
    pageKey, draft, dirty, saving,
    selectedField, setSelectedField,
    registerPage,
    setFieldText, setFieldStyle, toggleHidden,
    save, discard,
  };

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>;
}
