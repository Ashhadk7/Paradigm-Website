import { useEffect, useMemo, useState } from 'react';
import { ArrowUp, CheckCircle2, ExternalLink, GitBranch, History, LoaderCircle, RefreshCw, RotateCcw, ShieldCheck, Sparkles, XCircle } from 'lucide-react';
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
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [historyOpen, setHistoryOpen] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [activeAction, setActiveAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

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

  async function submit(event) {
    event.preventDefault();
    if (prompt.trim().length < 10) return;
    setActiveAction({ taskId: 'new', actionName: 'create' });
    setNotice('');
    try {
      const task = await createCodeTask(prompt);
      replaceTask(task);
      setPrompt('');
      setHistoryOpen(true);
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

  return (
    <div className="developer-workspace">
      <div className="developer-intro">
        <div>
          <span className="agent-page-tag">Repository workflow</span>
          <strong>Website code changes</strong>
          <p>Chat-driven website changes through GitHub pull requests, preview builds, admin approval, and rollback.</p>
        </div>
        <div className="developer-intro-actions">
          <span className="developer-guard"><ShieldCheck size={13} /> Admin approval required</span>
          <button type="button" className="developer-history-toggle" onClick={() => setHistoryOpen(value => !value)} aria-label={historyOpen ? 'Hide history' : 'Show history'}>
            {historyOpen ? '>>' : '<<'}
          </button>
        </div>
      </div>

      <div className={`developer-layout ${historyOpen ? 'is-open' : 'is-collapsed'}`}>
        <aside className="developer-sidebar" aria-label="Code change history">
          <div className="developer-sidebar-head">
            <div>
              <span className="developer-sidebar-kicker"><History size={13} /> Chat history</span>
              <strong>{tasks.length} request{tasks.length === 1 ? '' : 's'}</strong>
            </div>
            <button type="button" className="developer-new" onClick={() => { setSelectedTaskId(''); setPrompt(''); setNotice(''); }}>
              <span>New conversation</span>
            </button>
          </div>
          <div className="developer-sidebar-list">
            {loading && <p className="developer-message">Loading code requests...</p>}
            {!loading && !tasks.length && (
              <div className="developer-empty developer-empty--sidebar">
                <GitBranch size={20} />
                <p>Requests you approve will appear here.</p>
              </div>
            )}
            {tasks.map(task => (
              <button
                key={task.id}
                type="button"
                className={`developer-sidebar-item ${selectedTaskId === task.id ? 'is-selected' : ''}`}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <Status task={task} />
                <span>
                  <strong>{task.title || task.prompt}</strong>
                  <small>{formatDate(task.created_at)}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="developer-main">
          <div className="developer-thread">
            {!selectedTask && !loading && (
              <div className="developer-empty">
                <Sparkles size={22} />
                <h3>Create a controlled code update</h3>
                <p>The agent creates a separate branch and Vercel preview. Production changes only after your final approval.</p>
              </div>
            )}

            {selectedTask && (
              <>
                <article className="developer-bubble developer-bubble--user">
                  <span>Request</span>
                  <p>{selectedTask.prompt}</p>
                </article>

                <article className="developer-bubble developer-bubble--assistant">
                  <div className="developer-bubble-head">
                    <Status task={selectedTask} />
                    <time>{formatDate(selectedTask.created_at)}</time>
                  </div>
                  <p className="developer-summary">
                    {selectedTask.summary || 'The agent has not generated a proposal yet.'}
                  </p>

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
                      <a href={selectedTask.pull_request_url} target="_blank" rel="noreferrer">Pull request <ExternalLink size={12} /></a>
                    )}
                    {selectedTask.revert_pull_request_url && (
                      <a href={selectedTask.revert_pull_request_url} target="_blank" rel="noreferrer">Rollback PR <ExternalLink size={12} /></a>
                    )}
                    {selectedTask.preview_url && (
                      <a href={selectedTask.preview_url} target="_blank" rel="noreferrer">Deployment details <ExternalLink size={12} /></a>
                    )}
                  </div>

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
                </article>
              </>
            )}

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
              <button type="submit" disabled={prompt.trim().length < 10 || activeTaskBusy} aria-label="Save code change request">
                <ArrowUp size={17} />
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
