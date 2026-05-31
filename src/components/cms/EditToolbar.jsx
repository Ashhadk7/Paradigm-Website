import { useState } from 'react';
import { useEditMode } from '../../lib/editModeContext';

// Top bar shown while editing: page label, dirty indicator, Save / Discard / Exit.
export default function EditToolbar() {
  const { editing, pageKey, dirty, saving, save, discard, exitEditing, setSelectedField } = useEditMode();
  const [toast, setToast] = useState(null);

  if (!editing) return null;

  const handleSave = async () => {
    const res = await save();
    setToast(res.ok ? 'Saved' : `Save failed${res.error?.message ? `: ${res.error.message}` : ''}`);
    setTimeout(() => setToast(null), 2600);
  };

  const handleExit = () => {
    if (dirty && !window.confirm('You have unsaved changes. Discard them and exit?')) return;
    if (dirty) discard();
    exitEditing();
  };

  const btn = (variant) => ({
    padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
    fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 800,
    letterSpacing: '0.04em', textTransform: 'uppercase', border: '2px solid',
    ...(variant === 'gold'
      ? { background: '#C4A25B', color: '#34416D', borderColor: '#C4A25B' }
      : variant === 'ghost'
        ? { background: 'transparent', color: '#F5F3EF', borderColor: 'rgba(245,243,239,0.4)' }
        : { background: 'transparent', color: '#F5F3EF', borderColor: 'rgba(245,243,239,0.25)' }),
    opacity: saving ? 0.6 : 1,
  });

  return (
    <div
      onClick={() => setSelectedField(null)}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56, zIndex: 10000,
        background: '#34416D', borderBottom: '1px solid rgba(196,162,91,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', boxShadow: '0 2px 18px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C4A25B' }}>
          Edit Mode
        </span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(245,243,239,0.8)' }}>
          {pageKey ? `/${pageKey === 'home' ? '' : pageKey}` : ''}
        </span>
        {dirty && (
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#C4A25B', fontWeight: 700 }}>
            ● Unsaved changes
          </span>
        )}
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'rgba(245,243,239,0.45)' }}>
          Click any element to edit its text and style
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={(e) => e.stopPropagation()}>
        {toast && (
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#F5F3EF', marginRight: 6 }}>
            {toast}
          </span>
        )}
        <button style={btn('ghost')} onClick={discard} disabled={!dirty || saving}>Discard</button>
        <button style={btn('gold')} onClick={handleSave} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button style={btn('plain')} onClick={handleExit}>Exit</button>
      </div>
    </div>
  );
}
