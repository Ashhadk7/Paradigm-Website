import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// In-memory cache so we don't refetch on every navigation
const cache = {};

export function useContent(pageKey) {
  const [content, setContent] = useState(cache[pageKey] || null);
  const [loading, setLoading] = useState(!cache[pageKey]);

  useEffect(() => {
    if (cache[pageKey]) {
      setContent(cache[pageKey]);
      setLoading(false);
      return;
    }

    let cancelled = false;

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
    return () => { cancelled = true; };
  }, [pageKey]);

  return { content, loading };
}

// Force refresh a page's content (used after admin saves)
export function invalidateContent(pageKey) {
  delete cache[pageKey];
}

export function invalidateAll() {
  Object.keys(cache).forEach(k => delete cache[k]);
}
