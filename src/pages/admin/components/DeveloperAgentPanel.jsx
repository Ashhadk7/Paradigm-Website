import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUp,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  History,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import {
  createCodeRevert,
  createCodeTask,
  generateCodePreview,
  listCodeTasks,
  mergeCodeRevert,
  mergeCodeTask,
  pauseCodeTask,
  refreshCodeTask,
  rejectCodeTask,
  resumeCodeTask,
} from '../../../lib/developerAgentTasks';

const STATUS_LABELS = {
  requested: 'Requested',
  generating: 'Generating',
  generation_failed: 'Generation failed',
  paused: 'Paused',
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
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

function Status({ task }) {
  const success = ['merge_ready', 'merged', 'revert_ready', 'reverted'].includes(task.status);
  const failure = ['generation_failed', 'rejected'].includes(task.status);
  const paused = task.status === 'paused';
  return (
    <span className={`developer-status ${success ? 'is-success' : ''} ${failure ? 'is-failed' : ''} ${paused ? 'is-paused' : ''}`}>
      {success ? <CheckCircle2 size={12} /> : failure ? <XCircle size={12} /> : <LoaderCircle size={12} />}
      {STATUS_LABELS[task.status] || task.status}
    </span>
  );
}

export default function DeveloperAgentPanel({ railOpen }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [liveStep, setLiveStep] = useState(0);

  useEffect(() => {
    let active = true;
    listCodeTasks()
      .then(data => {
        if (!active) return;
        setTasks(data);
        setSelectedTaskId(current => current || data[0]?.id || '');
      })
      .catch(error => {
        if (active) setNotice(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const selectedTask = useMemo(
    () => tasks.find(task => task.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  function replaceTask(task) {
    setTasks(current => current.some(item => item.id === task.id)
      ? current.map(item => item.id === task.id ? task : item)
      : [task, ...current]);
    setSelectedTaskId(task.id);
  }

  async function run(taskId, actionName, operation, successMessage) {
    setLiveStep(0);
    setActiveAction({ taskId, actionName });
    setNotice('');
    try {
      const task = await operation(taskId);
      replaceTask(task);
      setNotice(successMessage);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setActiveAction(null);
    }
  }

  async function pauseSelected(taskId) {
    await run(taskId, 'pause', pauseCodeTask, 'Request paused. Resume it when you are ready to continue.');
  }

  async function resumeSelected(taskId) {
    await run(taskId, 'resume', resumeCodeTask, 'Request resumed. You can continue the approval flow.');
  }

  async function submit(event) {
    event.preventDefault();
    if (prompt.trim().length < 10) return;
    setLiveStep(0);
    setActiveAction({ taskId: 'new', actionName: 'create' });
    setNotice('');
    try {
      const task = await createCodeTask(prompt);
      replaceTask(task);
      setPrompt('');
      setNotice('Request saved. Approve generation when you are ready to create a review branch and preview.');
    } catch (error) {
      setNotice(error.message);
    } finally {
      setActiveAction(null);
    }
  }

  const activeTaskBusy = Boolean(activeAction?.taskId);
  const selectedBusy = selectedTask && activeAction?.taskId === selectedTask.id;
  const canGenerate = selectedTask && ['requested', 'generation_failed'].includes(selectedTask.status);
  const canRefresh = selectedTask && ['preview_ready', 'revert_preview_ready'].includes(selectedTask.status);
  const canMerge = selectedTask && selectedTask.status === 'merge_ready';
  const canRevert = selectedTask && selectedTask.status === 'merged';
  const canMergeRevert = selectedTask && selectedTask.status === 'revert_ready';
  const canReject = selectedTask && !['generating', 'merged', 'reverted', 'rejected', 'merging', 'reverting'].includes(selectedTask.status);
  const canPause = selectedTask && !['paused', 'generating', 'merging', 'reverting', 'merged', 'reverted', 'rejected'].includes(selectedTask.status);
  const canResume = selectedTask && selectedTask.status === 'paused';
  const liveMessages = activeAction?.actionName === 'pause'
    ? ['Pausing request…', 'Saving the current state…']
    : activeAction?.actionName === 'resume'
      ? ['Resuming request…', 'Restoring the approval state…']
      : activeAction?.actionName === 'generate'
        ? ['Reviewing your request…', 'Scanning editable files…', 'Drafting the proposal…', 'Creating the preview branch…']
        : activeAction?.actionName === 'refresh'
          ? ['Refreshing checks…', 'Pulling the latest preview status…']
          : activeAction?.actionName === 'merge'
            ? ['Preparing production merge…', 'Waiting for approval checks…']
            : activeAction?.actionName === 'revert'
              ? ['Creating rollback preview…', 'Preparing the rollback branch…']
              : activeAction?.actionName === 'merge-revert'
                ? ['Publishing rollback…', 'Applying the approved restore…']
                : activeAction?.actionName === 'reject'
                  ? ['Closing the request…', 'Shutting down any open pull requests…']
                  : ['Working…'];

  useEffect(() => {
    if (!activeAction) return undefined;
    const timer = window.setInterval(() => {
      setLiveStep(current => (current + 1) % liveMessages.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [activeAction, liveMessages.length]);

  return (
    <div className="agent-body">
      {/* ── LEFT SIDEBAR ── mirrors agent-rail from Quick CMS */}
      {railOpen && (
        <aside className="agent-rail" aria-label="Code change history">
          {/* New conversation button */}
          <button
            type="button"
            className="agent-new"
            onClick={() => { setSelectedTaskId(''); setPrompt(''); setNotice(''); }}
          >
            New conversation
          </button>

          {/* Section heading */}
          <div className="agent-rail-title">
            <History size={13} /> Chat history
          </div>

          {/* Request count */}
          <div className="dev-rail-count">
            {tasks.length} request{tasks.length === 1 ? '' : 's'}
          </div>

          {/* Task list */}
          <div className="agent-session-list">
            {loading && <p className="agent-rail-empty">Loading...</p>}

            {!loading && !tasks.length && (
              <div className="dev-rail-empty-state">
                <GitBranch size={18} />
                <p className="agent-rail-empty">Requests you approve will appear here.</p>
              </div>
            )}

            {tasks.map(task => (
              <button
                key={task.id}
                type="button"
                className={`agent-session ${selectedTaskId === task.id ? 'is-selected' : ''}`}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <span>
                  <strong>{task.title || task.prompt}</strong>
                  <small>{formatDate(task.created_at)}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* ── RIGHT MAIN WORKSPACE ── mirrors agent-workspace from Quick CMS */}
      <div className="agent-workspace">
        {/* Context bar */}
        <div className="agent-context">
          <div>
            <span className="agent-page-tag">Repository workflow</span>
            <strong>Website code changes</strong>
          </div>
          <span className="developer-guard">
            <ShieldCheck size={12} /> Admin approval required
          </span>
        </div>

        {/* Thread / history area */}
        <div className="agent-history">
          {!selectedTask && !loading && (
            <div className="agent-welcome">
              <div className="agent-welcome-icon">
                <Sparkles size={20} />
              </div>
              <h3>Create a controlled code update</h3>
              <p>
                The agent creates a separate branch and Vercel preview.
                Production changes only after your final approval.
              </p>
            </div>
          )}

          {selectedTask && (
            <>
              {/* User message bubble */}
              <article className="agent-stage">
                <div className="agent-prompt">
                  <span>Request</span>
                  <p>{selectedTask.prompt}</p>
                </div>

                {/* Agent response bubble */}
                <div className="agent-result">
                  <div className="agent-result-state">
                    <Status task={selectedTask} />
                    <time className="dev-bubble-time">{formatDate(selectedTask.created_at)}</time>
                  </div>

                  <p className="developer-summary">{selectedTask.summary || 'The agent has not generated a proposal yet.'}</p>

                  {selectedTask.error_message && (
                    <p className="developer-error">{selectedTask.error_message}</p>
                  )}

                  {selectedTask.changed_files?.length > 0 && (
                    <div className="developer-files">
                      {selectedTask.changed_files.map(file => (
                        <span key={file.path}>{file.path}</span>
                      ))}
                    </div>
                  )}

                  <div className="developer-links">
                    {selectedTask.pull_request_url && (
                      <a href={selectedTask.pull_request_url} target="_blank" rel="noreferrer">
                        Pull request <ExternalLink size={12} />
                      </a>
                    )}
                    {selectedTask.revert_pull_request_url && (
                      <a href={selectedTask.revert_pull_request_url} target="_blank" rel="noreferrer">
                        Rollback PR <ExternalLink size={12} />
                      </a>
                    )}
                    {selectedTask.preview_url && (
                      <a href={selectedTask.preview_url} target="_blank" rel="noreferrer">
                        Deployment details <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {(activeAction?.taskId === selectedTask.id || ['generating', 'preview_ready', 'merge_ready', 'revert_preview_ready', 'revert_ready'].includes(selectedTask.status)) && (
                    <div className="developer-live-strip" aria-live="polite">
                      <LoaderCircle size={13} />
                      <span>{liveMessages[liveStep]}</span>
                    </div>
                  )}

                  {canPause && (
                    <button
                      type="button"
                      className="agent-restore"
                      disabled={selectedBusy}
                      onClick={() => pauseSelected(selectedTask.id)}
                    >
                      Pause request
                    </button>
                  )}
                  {canResume && (
                    <button
                      type="button"
                      className="agent-restore"
                      disabled={selectedBusy}
                      onClick={() => resumeSelected(selectedTask.id)}
                    >
                      Resume request
                    </button>
                  )}

                  {/* Approval action buttons */}
                  <div className="developer-approval-card">
                    <div>
                      <strong>Approval workflow</strong>
                      <p>Generation, preview refresh, merge, and rollback all stay behind manual approval.</p>
                    </div>
                    <div className="developer-actions">
                      {canGenerate && (
                        <button
                          className="agent-primary"
                          type="button"
                          disabled={selectedBusy}
                          onClick={() => run(selectedTask.id, 'generate', generateCodePreview, 'Branch and pull request created. Refresh checks when preview is ready.')}
                        >
                          Approve and generate preview
                        </button>
                      )}
                      {canRefresh && (
                        <button
                          className="agent-secondary"
                          type="button"
                          disabled={selectedBusy}
                          onClick={() => run(selectedTask.id, 'refresh', refreshCodeTask, 'Deployment and build checks refreshed.')}
                        >
                          <RefreshCw size={13} /> Refresh checks
                        </button>
                      )}
                      {canMerge && (
                        <button
                          className="agent-primary"
                          type="button"
                          disabled={selectedBusy}
                          onClick={() => run(selectedTask.id, 'merge', mergeCodeTask, 'Approved change merged into main.')}
                        >
                          Approve and merge
                        </button>
                      )}
                      {canRevert && (
                        <button
                          className="agent-secondary"
                          type="button"
                          disabled={selectedBusy}
                          onClick={() => run(selectedTask.id, 'revert', createCodeRevert, 'Rollback preview created. Review it before merging.')}
                        >
                          <RotateCcw size={13} /> Create rollback preview
                        </button>
                      )}
                      {canMergeRevert && (
                        <button
                          className="agent-primary"
                          type="button"
                          disabled={selectedBusy}
                          onClick={() => run(selectedTask.id, 'merge-revert', mergeCodeRevert, 'Rollback approved and merged into main.')}
                        >
                          Approve rollback merge
                        </button>
                      )}
                      {canReject && (
                        <button
                          className="agent-secondary"
                          type="button"
                          disabled={selectedBusy}
                          onClick={() => run(selectedTask.id, 'reject', rejectCodeTask, 'Request rejected and any open pull request was closed.')}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </>
          )}

          {notice && <p className="agent-notice">{notice}</p>}
        </div>

        {/* Composer — mirrors agent-composer from Quick CMS */}
        <form className="agent-composer" onSubmit={submit}>
          <textarea
            value={prompt}
            onChange={event => setPrompt(event.target.value)}
            placeholder="Example: Redesign the navbar with a compact sticky layout and a stronger contact action."
            rows={2}
          />
          <div className="agent-composer-meta">
            <span>Request first. Branch creation and publishing each require approval.</span>
            <button type="submit" disabled={prompt.trim().length < 10 || activeTaskBusy} aria-label="Save code change request">
              <ArrowUp size={17} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
