import { useEffect, useState } from 'react';
import { ArrowUp, CheckCircle2, ExternalLink, GitBranch, LoaderCircle, RefreshCw, RotateCcw, ShieldCheck, XCircle } from 'lucide-react';
import {
  createCodeRevert,
  createCodeTask,
  generateCodePreview,
  listCodeTasks,
  mergeCodeRevert,
  mergeCodeTask,
  refreshCodeTask,
  rejectCodeTask,
} from '../../../lib/developerAgentTasks';

const STATUS_LABELS = {
  requested: 'Requested',
  generating: 'Generating',
  generation_failed: 'Generation failed',
  preview_ready: 'Preview building',
  merge_ready: 'Ready for approval',
  merging: 'Publishing',
  merged: 'Published',
  rejected: 'Rejected',
  revert_preview_ready: 'Rollback preview building',
  revert_ready: 'Rollback ready',
  reverting: 'Rolling back',
  reverted: 'Rolled back',
};

function formatDate(value) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value));
}

function Status({ task }) {
  const success = ['merge_ready', 'merged', 'revert_ready', 'reverted'].includes(task.status);
  const failure = ['generation_failed', 'rejected'].includes(task.status);
  return (
    <span className={`developer-status ${success ? 'is-success' : ''} ${failure ? 'is-failed' : ''}`}>
      {success ? <CheckCircle2 size={12} /> : failure ? <XCircle size={12} /> : <LoaderCircle size={12} />}
      {STATUS_LABELS[task.status] || task.status}
    </span>
  );
}

export default function DeveloperAgentPanel() {
  const [tasks, setTasks] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [busyId, setBusyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    listCodeTasks()
      .then(data => { if (active) setTasks(data); })
      .catch(error => { if (active) setNotice(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function replaceTask(task) {
    setTasks(current => current.some(item => item.id === task.id)
      ? current.map(item => item.id === task.id ? task : item)
      : [task, ...current]);
  }

  async function run(taskId, operation, successMessage) {
    setBusyId(taskId);
    setNotice('');
    try {
      const task = await operation(taskId);
      replaceTask(task);
      setNotice(successMessage);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusyId('');
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (prompt.trim().length < 10) return;
    setBusyId('new');
    setNotice('');
    try {
      const task = await createCodeTask(prompt);
      replaceTask(task);
      setPrompt('');
      setNotice('Request saved. Approve generation when you are ready to create a review branch and preview.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setBusyId('');
    }
  }

  return (
    <div className="developer-workspace">
      <div className="developer-intro">
        <div>
          <span className="agent-page-tag">Repository workflow</span>
          <strong>Website code changes</strong>
          <p>Structure, theme, components, navbar and footer changes through reviewed GitHub pull requests.</p>
        </div>
        <span className="developer-guard"><ShieldCheck size={13} /> Admin approval required</span>
      </div>

      <div className="developer-history">
        {!loading && !tasks.length && (
          <div className="developer-empty">
            <GitBranch size={22} />
            <h3>Create a controlled code update</h3>
            <p>The agent creates a separate branch and Vercel preview. Production changes only after your final approval.</p>
          </div>
        )}
        {loading && <p className="developer-message">Loading code requests...</p>}
        {tasks.map(task => (
          <article className="developer-task" key={task.id}>
            <header>
              <Status task={task} />
              <time>{formatDate(task.created_at)}</time>
            </header>
            <p className="developer-request">{task.prompt}</p>
            {task.summary && <p className="developer-summary">{task.summary}</p>}
            {task.error_message && <p className="developer-error">{task.error_message}</p>}
            {task.changed_files?.length > 0 && (
              <div className="developer-files">
                {task.changed_files.map(file => <span key={file.path}>{file.path}</span>)}
              </div>
            )}
            <div className="developer-links">
              {task.pull_request_url && <a href={task.pull_request_url} target="_blank" rel="noreferrer">Pull request <ExternalLink size={12} /></a>}
              {task.revert_pull_request_url && <a href={task.revert_pull_request_url} target="_blank" rel="noreferrer">Rollback PR <ExternalLink size={12} /></a>}
              {task.preview_url && <a href={task.preview_url} target="_blank" rel="noreferrer">Deployment details <ExternalLink size={12} /></a>}
            </div>
            <div className="developer-actions">
              {['requested', 'generation_failed'].includes(task.status) && (
                <button className="agent-primary" type="button" disabled={Boolean(busyId)} onClick={() => run(task.id, generateCodePreview, 'Branch and pull request created. Wait for preview checks, then refresh status.')}>
                  Approve and generate preview
                </button>
              )}
              {['preview_ready', 'revert_preview_ready'].includes(task.status) && (
                <button className="agent-secondary" type="button" disabled={Boolean(busyId)} onClick={() => run(task.id, refreshCodeTask, 'Deployment and build checks refreshed.')}>
                  <RefreshCw size={13} /> Refresh checks
                </button>
              )}
              {task.status === 'merge_ready' && (
                <button className="agent-primary" type="button" disabled={Boolean(busyId)} onClick={() => run(task.id, mergeCodeTask, 'Approved change merged into main. Production deployment will now run.')}>
                  Approve and merge
                </button>
              )}
              {task.status === 'merged' && (
                <button className="agent-secondary" type="button" disabled={Boolean(busyId)} onClick={() => run(task.id, createCodeRevert, 'Rollback pull request created. Review its preview before merging.')}>
                  <RotateCcw size={13} /> Create rollback preview
                </button>
              )}
              {task.status === 'revert_ready' && (
                <button className="agent-primary" type="button" disabled={Boolean(busyId)} onClick={() => run(task.id, mergeCodeRevert, 'Rollback approved and merged into main.')}>
                  Approve rollback merge
                </button>
              )}
              {!['generating', 'merged', 'reverted', 'rejected', 'merging', 'reverting'].includes(task.status) && (
                <button className="agent-secondary" type="button" disabled={Boolean(busyId)} onClick={() => run(task.id, rejectCodeTask, 'Request rejected. Any open pull request has been closed.')}>
                  Reject
                </button>
              )}
            </div>
          </article>
        ))}
        {notice && <p className="developer-message">{notice}</p>}
      </div>

      <form className="developer-composer" onSubmit={submit}>
        <textarea
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
          placeholder="Example: Redesign the navbar with a compact sticky layout and a stronger contact action."
          rows={3}
        />
        <div>
          <span>Request first. Branch creation and publishing each require approval.</span>
          <button type="submit" disabled={prompt.trim().length < 10 || Boolean(busyId)} aria-label="Save code change request">
            <ArrowUp size={17} />
          </button>
        </div>
      </form>
    </div>
  );
}
