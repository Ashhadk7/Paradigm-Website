import { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Bot,
  Check,
  Code2,
  History,
  MessageSquare,
  Plus,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { buildCmsProposal } from '../../../lib/cmsAgentProposal';
import {
  appendAgentStage,
  createAgentSession,
  listAgentSessions,
  loadAgentStages,
  revertAgentStages,
} from '../../../lib/cmsAgentSessions';
import DeveloperAgentPanel from './DeveloperAgentPanel';
import './AgentPanel.css';

const STARTERS = [
  'Change the hero heading to "A clearer investment perspective."',
  'Change the hero subheading to "Built for institutions and advisors who expect more."',
  'Tighten the hero spacing and give the headline more room.',
];

function createTitle(prompt) {
  const compact = prompt.replace(/\s+/g, ' ').trim();
  return compact.length > 48 ? `${compact.slice(0, 45)}...` : compact;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export default function AgentPanel({ activePage, content, fields, presentation, saving, onApply, onRestore }) {
  const codeAgentEnabled = import.meta.env.VITE_ENABLE_CODE_AGENT !== 'false';
  const [open, setOpen] = useState(false);
  const [railOpen, setRailOpen] = useState(true);
  const [mode, setMode] = useState('quick');
  const [prompt, setPrompt] = useState('');
  const [proposal, setProposal] = useState(null);
  const [notice, setNotice] = useState('');
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [stages, setStages] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const historyRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;

    async function fetchSessions() {
      if (!cancelled) {
        setLoadingSessions(true);
        setHistoryError('');
      }
      try {
        const rows = await listAgentSessions(activePage);
        if (!cancelled) setSessions(rows);
      } catch {
        if (!cancelled) {
          setHistoryError('Apply the chat history migration to store conversations.');
        }
      } finally {
        if (!cancelled) setLoadingSessions(false);
      }
    }

    Promise.resolve().then(fetchSessions);
    return () => {
      cancelled = true;
    };
  }, [open, activePage]);

  useEffect(() => {
    if (!open || !historyRef.current) return;
    historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [open, proposal, notice, stages]);

  async function selectSession(session) {
    setActiveSession(session);
    setProposal(null);
    setNotice('');
    try {
      setStages(await loadAgentStages(session.id));
      setHistoryError('');
    } catch {
      setHistoryError('This conversation could not be loaded.');
    }
  }

  function startConversation() {
    setActiveSession(null);
    setStages([]);
    setProposal(null);
    setPrompt('');
    setNotice('');
  }

  function submitPrompt(event) {
    event?.preventDefault();
    const nextProposal = buildCmsProposal({
      pageKey: activePage,
      prompt,
      presentation,
      content,
      fields,
    });

    if (nextProposal.error) {
      setProposal(null);
      setNotice(nextProposal.error);
      return;
    }

    setProposal(nextProposal);
    setNotice('');
  }

  async function applyProposal() {
    let session = activeSession;

    try {
      if (!session) {
        session = await createAgentSession({
          title: createTitle(proposal.request),
          pageKey: activePage,
        });
        setActiveSession(session);
        setSessions(current => [session, ...current]);
      }
    } catch {
      setHistoryError('Chat history is not ready. Apply the new session migration before publishing assistant requests.');
      return;
    }

    const beforeContent = { ...content };
    const beforeSettings = { ...presentation };
    const applied = await onApply(proposal);
    if (!applied) return;

    try {
      const stage = await appendAgentStage(session.id, {
        prompt: proposal.request,
        changes: proposal.changes,
        beforeContent,
        afterContent: proposal.content,
        beforeSettings,
        afterSettings: proposal.settings,
      });
      setStages(current => [...current, stage]);
      setSessions(current => current.map(item => item.id === session.id
        ? { ...item, updated_at: new Date().toISOString() }
        : item));
      setNotice(`Published to ${pageLabel}. You can restore this request at any time.`);
      setProposal(null);
      setPrompt('');
    } catch {
      setNotice('The update was published, but the history record failed to save.');
    }
  }

  async function restoreBeforeStage(stage) {
    const restored = await onRestore({
      content: stage.beforeContent,
      settings: stage.beforeSettings,
    });
    if (!restored) return;

    try {
      await revertAgentStages(activeSession.id, stage.sequence);
      setStages(current => current.map(item => item.sequence >= stage.sequence && item.status === 'applied'
        ? { ...item, status: 'reverted' }
        : item));
      setNotice(`Restored ${pageLabel} to its state before request ${stage.sequence}.`);
    } catch {
      setNotice('The update was restored, but the conversation status could not be updated.');
    }
  }

  const appliedCount = stages.filter(stage => stage.status === 'applied').length;
  const canCompose = Boolean(fields?.length);
  const pageLabel = activePage === 'home'
    ? 'Homepage'
    : activePage.replaceAll('_', ' ').replace(/\b\w/g, character => character.toUpperCase());

  return (
    <>
      {open && (
        <section className={`agent-console ${railOpen ? 'agent-console--rail' : ''}`} aria-label="Paradigm page assistant">
          <header className="agent-header">
            <div className="agent-brand">
              <span className="agent-mark">P</span>
              <div>
                <p>Paradigm Studio</p>
                <h2>{mode === 'quick' ? 'Design Assistant' : 'Code Change Agent'}</h2>
              </div>
            </div>
            <div className="agent-header-actions">
              <span className="agent-secure"><ShieldCheck size={12} /> {mode === 'quick' ? 'Controlled edits' : 'Reviewed branches'}</span>
              <button className="agent-quiet-action agent-rail-toggle" type="button" onClick={() => setRailOpen(value => !value)} aria-label={railOpen ? 'Hide history' : 'Show history'}>
                {railOpen ? '>>' : '<<'}
              </button>
              <button className="agent-quiet-action" type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
                <X size={19} />
              </button>
            </div>
          </header>

          <nav className="agent-mode-switch" aria-label="Assistant mode">
            <button type="button" className={mode === 'quick' ? 'is-active' : ''} onClick={() => setMode('quick')}>
              <SlidersHorizontal size={14} /> Quick CMS Edit
            </button>
            {codeAgentEnabled && (
              <button type="button" className={mode === 'code' ? 'is-active' : ''} onClick={() => setMode('code')}>
                <Code2 size={14} /> Code Change
              </button>
            )}
          </nav>

          {codeAgentEnabled && mode === 'code' ? <DeveloperAgentPanel railOpen={railOpen} onRailToggle={() => setRailOpen(v => !v)} /> : (
          <div className="agent-body">
            {railOpen && (
              <aside className="agent-rail" aria-label="Saved conversations">
                <button type="button" className="agent-new" onClick={startConversation}>
                  <Plus size={15} /> New conversation
                </button>
                <div className="agent-rail-title"><History size={13} /> Conversations</div>
                {loadingSessions && <p className="agent-rail-empty">Loading...</p>}
                {!loadingSessions && !sessions.length && !historyError && (
                  <p className="agent-rail-empty">Applied requests will appear here.</p>
                )}
                <div className="agent-session-list">
                  {sessions.map(session => (
                    <button
                      type="button"
                      key={session.id}
                      onClick={() => selectSession(session)}
                      className={`agent-session ${activeSession?.id === session.id ? 'is-selected' : ''}`}
                    >
                      <MessageSquare size={13} />
                      <span>
                        <strong>{session.title}</strong>
                        <small>{formatDate(session.updated_at)}</small>
                      </span>
                    </button>
                  ))}
                </div>
                {historyError && <p className="agent-rail-alert">{historyError}</p>}
              </aside>
            )}

            <div className="agent-workspace">
              <div className="agent-context">
                <div>
                  <span className="agent-page-tag">Editing</span>
                  <strong>{canCompose ? `${pageLabel} content and styling` : 'Select a CMS page to edit'}</strong>
                </div>
                <span className="agent-active-count"><SlidersHorizontal size={12} /> {appliedCount} active</span>
              </div>

              <div className="agent-history" ref={historyRef}>
                {!stages.length && !proposal && (
                  <div className="agent-welcome">
                    <div className="agent-welcome-icon"><Sparkles size={20} /></div>
                    <h3>Direct the visual treatment</h3>
                    <p>Request a copy or layout adjustment. Review every replacement before anything is published.</p>
                    <div className="agent-starters">
                      {STARTERS.map(starter => (
                        <button type="button" key={starter} onClick={() => setPrompt(starter)}>{starter}</button>
                      ))}
                    </div>
                  </div>
                )}

                {stages.map(stage => (
                  <article className="agent-stage" key={stage.id}>
                    <div className="agent-prompt">
                      <span>Request {stage.sequence}</span>
                      <p>{stage.prompt}</p>
                    </div>
                    <div className={`agent-result ${stage.status === 'reverted' ? 'is-reverted' : ''}`}>
                      <div className="agent-result-state">
                        {stage.status === 'applied' ? <Check size={13} /> : <RotateCcw size={13} />}
                        {stage.status === 'applied' ? 'Published' : 'Restored'}
                      </div>
                      <div className="agent-result-items">
                        {stage.changes.map(change => (
                          <div key={change.controlName}>
                            <span>{change.label}</span>
                            <strong>{change.after}</strong>
                          </div>
                        ))}
                      </div>
                      {stage.status === 'applied' && (
                        <button type="button" className="agent-restore" onClick={() => restoreBeforeStage(stage)} disabled={saving}>
                          <RotateCcw size={13} /> Restore before this request
                        </button>
                      )}
                    </div>
                  </article>
                ))}

                {canCompose && proposal && (
                  <article className="agent-stage">
                    <div className="agent-prompt is-draft">
                      <span>Pending approval</span>
                      <p>{proposal.request}</p>
                    </div>
                    <div className="agent-review">
                      <h3>Proposed update</h3>
                      <p>{proposal.summary}</p>
                      {proposal.changes.map(change => (
                        <div className="agent-diff" key={change.controlName}>
                          <span>{change.label}</span>
                          <div><del>{change.before}</del><strong>{change.after}</strong></div>
                        </div>
                      ))}
                      <div className="agent-review-actions">
                        <button type="button" className="agent-secondary" onClick={() => setProposal(null)}>Discard</button>
                        <button type="button" className="agent-primary" onClick={applyProposal} disabled={saving}>
                          {saving ? 'Publishing...' : 'Approve and publish'}
                        </button>
                      </div>
                    </div>
                  </article>
                )}

                {notice && <p className="agent-notice">{notice}</p>}
              </div>

              <form className="agent-composer" onSubmit={submitPrompt}>
                <textarea
                  value={prompt}
                  onChange={event => setPrompt(event.target.value)}
                  disabled={!canCompose}
                  placeholder={canCompose ? 'Example: Change the hero heading to "A sharper message."' : 'Open a CMS page to begin.'}
                  rows={2}
                />
                <div className="agent-composer-meta">
                  <span>Review required before publish</span>
                  <button type="submit" disabled={!prompt.trim() || !canCompose} aria-label="Draft proposed changes">
                    <ArrowUp size={17} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          )}
        </section>
      )}

      <button type="button" className={`agent-launcher ${open ? 'is-open' : ''}`} onClick={() => setOpen(value => !value)} aria-label={open ? 'Close design assistant' : 'Open design assistant'}>
        <span className="agent-launcher-icon">{open ? <X size={21} /> : <Bot size={22} />}</span>
        {!open && (
          <span className="agent-launcher-copy">
            <strong>Design Assistant</strong>
            <small>Adjust your site</small>
          </span>
        )}
        {!open && appliedCount > 0 && <span className="agent-launcher-badge">{appliedCount}</span>}
      </button>
    </>
  );
}
