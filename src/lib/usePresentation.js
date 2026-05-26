import { useEffect, useState } from 'react';
import { normalizePresentation } from './presentationSchema.js';
import { supabase } from './supabase';

const cache = {};

export function usePresentation(pageKey) {
  const initialSettings = cache[pageKey] || normalizePresentation(pageKey);
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    function handleUpdate(event) {
      if (event.detail?.pageKey !== pageKey) return;
      const normalized = normalizePresentation(pageKey, event.detail.settings);
      cache[pageKey] = normalized;
      setSettings(normalized);
    }

    function handleStorageUpdate(event) {
      if (event.key !== 'paradigm-presentation-update' || !event.newValue) return;

      try {
        const update = JSON.parse(event.newValue);
        if (update.pageKey !== pageKey) return;

        const normalized = normalizePresentation(pageKey, update.settings);
        cache[pageKey] = normalized;
        setSettings(normalized);
      } catch {
        // Ignore malformed cross-tab update payloads.
      }
    }

    window.addEventListener('paradigm-presentation-updated', handleUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    let cancelled = false;

    async function fetchSettings() {
      if (cache[pageKey]) {
        setSettings(cache[pageKey]);
        return;
      }

      const { data, error } = await supabase
        .from('page_presentation')
        .select('settings')
        .eq('page_key', pageKey)
        .maybeSingle();

      if (cancelled) return;

      const normalized = normalizePresentation(pageKey, error ? undefined : data?.settings);
      cache[pageKey] = normalized;
      setSettings(normalized);
    }

    fetchSettings();

    return () => {
      cancelled = true;
      window.removeEventListener('paradigm-presentation-updated', handleUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [pageKey]);

  return settings;
}

export function publishPresentationUpdate(pageKey, settings) {
  const normalized = normalizePresentation(pageKey, settings);
  cache[pageKey] = normalized;

  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent('paradigm-presentation-updated', {
    detail: { pageKey, settings: normalized },
  }));

  try {
    window.localStorage.setItem('paradigm-presentation-update', JSON.stringify({
      pageKey,
      settings: normalized,
      updatedAt: Date.now(),
    }));
  } catch {
    // Local storage can be unavailable in private or restricted contexts.
  }
}
