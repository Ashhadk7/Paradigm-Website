import { supabase } from './supabase';

export async function listAgentSessions(pageKey) {
  const { data, error } = await supabase
    .from('cms_agent_sessions')
    .select('id, title, page_key, created_at, updated_at')
    .eq('page_key', pageKey)
    .order('updated_at', { ascending: false })
    .limit(30);

  if (error) throw error;
  return data || [];
}

export async function loadAgentStages(sessionId) {
  const { data, error } = await supabase
    .from('cms_agent_stages')
    .select('id, sequence_number, prompt, changes, before_content, after_content, before_settings, after_settings, status, created_at')
    .eq('session_id', sessionId)
    .order('sequence_number', { ascending: true });

  if (error) throw error;

  return (data || []).map(stage => ({
    id: stage.id,
    sequence: stage.sequence_number,
    prompt: stage.prompt,
    changes: stage.changes,
    beforeContent: stage.before_content,
    afterContent: stage.after_content,
    beforeSettings: stage.before_settings,
    afterSettings: stage.after_settings,
    status: stage.status,
    createdAt: stage.created_at,
  }));
}

export async function createAgentSession({ title, pageKey }) {
  const { data, error } = await supabase.rpc('create_cms_agent_session', {
    p_title: title,
    p_page_key: pageKey,
  });

  if (error) throw error;
  return data;
}

export async function appendAgentStage(sessionId, stage) {
  const { data, error } = await supabase.rpc('append_cms_agent_stage', {
    p_session_id: sessionId,
    p_prompt: stage.prompt,
    p_changes: stage.changes,
    p_before_content: stage.beforeContent,
    p_after_content: stage.afterContent,
    p_before_settings: stage.beforeSettings,
    p_after_settings: stage.afterSettings,
  });

  if (error) throw error;
  return {
    id: data.id,
    sequence: data.sequence_number,
    prompt: data.prompt,
    changes: data.changes,
    beforeContent: data.before_content,
    afterContent: data.after_content,
    beforeSettings: data.before_settings,
    afterSettings: data.after_settings,
    status: data.status,
    createdAt: data.created_at,
  };
}

export async function revertAgentStages(sessionId, sequenceNumber) {
  const { error } = await supabase.rpc('revert_cms_agent_stages', {
    p_session_id: sessionId,
    p_from_sequence: sequenceNumber,
  });

  if (error) throw error;
}
