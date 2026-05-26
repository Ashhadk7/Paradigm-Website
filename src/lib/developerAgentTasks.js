import { supabase } from './supabase';

async function callCodeAgent(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Your administrator session has expired.');
  const response = await fetch(`/api/code-agent/${path}`, {
    method: options.method || 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'The code-agent request failed.');
  return result;
}

export async function listCodeTasks() {
  const result = await callCodeAgent('tasks', { method: 'GET' });
  return result.tasks;
}

export async function createCodeTask(prompt) {
  const result = await callCodeAgent('tasks', { body: { prompt } });
  return result.task;
}

async function execute(action, taskId, extra = {}) {
  const result = await callCodeAgent(action, { body: { taskId, ...extra } });
  return result.task;
}

export const generateCodePreview = taskId => execute('generate', taskId);
export const refreshCodeTask = taskId => execute('refresh', taskId);
export const mergeCodeTask = taskId => execute('merge', taskId);
export const rejectCodeTask = taskId => execute('reject', taskId);
export const createCodeRevert = taskId => execute('revert', taskId);
export const mergeCodeRevert = taskId => execute('merge', taskId, { revert: true });

