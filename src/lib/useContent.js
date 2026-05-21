import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// In-memory cache so we don't refetch on every navigation
const cache = {};

export function useContent(pageKey) {
  const [content, setContent] = useState(cache[pageKey] || null);
  const [loading, setLoading] = useState(!cache[pageKey]);

  useEffect(() => {
    const handleContentUpdate = (event) => {
      if (event.detail?.pageKey === pageKey) {
        setContent(event.detail.content);
        setLoading(false);
      }
    };

    const handleStorageUpdate = (event) => {
      if (event.key !== 'paradigm-content-update' || !event.newValue) return;

      try {
        const update = JSON.parse(event.newValue);
        if (update.pageKey === pageKey) {
          cache[pageKey] = update.content;
          setContent(update.content);
          setLoading(false);
        }
      } catch {
        // Ignore malformed cross-tab update payloads.
      }
    };

    window.addEventListener('paradigm-content-updated', handleContentUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    let cancelled = false;

    if (cache[pageKey]) {
      Promise.resolve().then(() => {
        if (!cancelled) {
          setContent(cache[pageKey]);
          setLoading(false);
        }
      });

      return () => {
        cancelled = true;
        window.removeEventListener('paradigm-content-updated', handleContentUpdate);
        window.removeEventListener('storage', handleStorageUpdate);
      };
    }

    async function fetch() {
      const { data, error } = await supabase
        .from('page_content')
        .select('content')
        .eq('page_key', pageKey)
        .single();

      if (!cancelled && data && !error) {
        cache[pageKey] = data.content;
        setContent(data.content);
      }
      if (!cancelled) setLoading(false);
    }

    fetch();
    return () => {
      cancelled = true;
      window.removeEventListener('paradigm-content-updated', handleContentUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [pageKey]);

  return { content, loading };
}

// Force refresh a page's content (used after admin saves)
export function invalidateContent(pageKey) {
  delete cache[pageKey];
}

export function publishContentUpdate(pageKey, content) {
  cache[pageKey] = content;

  if (typeof window === 'undefined') return;

  window.dispatchEvent(new CustomEvent('paradigm-content-updated', {
    detail: { pageKey, content },
  }));

  try {
    window.localStorage.setItem('paradigm-content-update', JSON.stringify({
      pageKey,
      content,
      updatedAt: Date.now(),
    }));
  } catch {
    // Local storage can be unavailable in private or restricted contexts.
  }
}

export function invalidateAll() {
  Object.keys(cache).forEach(k => delete cache[k]);
}
