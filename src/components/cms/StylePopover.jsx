import { useEditMode } from '../../lib/editModeContext';
import {
  getStyle,
  TEXT_ALIGN_OPTIONS,
  FONT_SIZE_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  SPACING_OPTIONS,
  LETTER_SPACING_OPTIONS,
  COLOR_OPTIONS,
} from '../../lib/elementStyles';

// Floating panel that edits the style of the currently selected field.
// Anchored top-right under the toolbar; constrained to the safe style whitelist.
export default function StylePopover() {
  const {
    editing, selectedField, draft, setFieldStyle, toggleHidden, setSelectedField,
  } = useEditMode();

  if (!editing || !selectedField) return null;

  const current = getStyle(draft, selectedField);

  const row = { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 };
  const label = {
    fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 800,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: '#637890',
  };
  const segGroup = { display: 'flex', gap: 4, flexWrap: 'wrap' };
  const seg = (active) => ({
    flex: '0 0 auto', padding: '6px 10px', borderRadius: 4, cursor: 'pointer',
    fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600,
    border: `1px solid ${active ? '#C4A25B' : 'rgba(52,65,109,0.18)'}`,
    background: active ? '#C4A25B' : '#fff',
    color: active ? '#34416D' : '#34416D',
  });
  const select = {
    width: '100%', padding: '7px 8px', borderRadius: 4,
    border: '1px solid rgba(52,65,109,0.18)', fontFamily: 'Inter, sans-serif',
    fontSize: 13, color: '#2C2C2C', background: '#fff',
  };

  return (
    <div
      style={{
        position: 'fixed', top: 76, right: 18, zIndex: 10001, width: 268,
        background: '#fff', border: '1px solid rgba(52,65,109,0.14)',
        borderRadius: 8, boxShadow: '0 18px 48px rgba(52,65,109,0.22)',
        padding: '16px 16px 18px', fontFamily: 'Inter, sans-serif',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#34416D' }}>
          {selectedField}
        </span>
        <button
          onClick={() => setSelectedField(null)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#637890', fontSize: 16, lineHeight: 1 }}
          aria-label="Close style panel"
        >
          ✕
        </button>
      </div>

      {/* Text align */}
      <div style={row}>
        <span style={label}>Alignment</span>
        <div style={segGroup}>
          {TEXT_ALIGN_OPTIONS.map((opt) => (
            <button key={opt} style={seg(current.textAlign === opt)}
              onClick={() => setFieldStyle(selectedField, { textAlign: current.textAlign === opt ? undefined : opt })}>
              {opt === 'left' ? '⤙ Left' : opt === 'center' ? '↔ Center' : 'Right ⤚'}
            </button>
          ))}
        </div>
      </div>

      {/* Font size */}
      <div style={row}>
        <span style={label}>Font size</span>
        <select style={select} value={current.fontSize || ''}
          onChange={(e) => setFieldStyle(selectedField, { fontSize: e.target.value || undefined })}>
          <option value="">Default</option>
          {FONT_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Font weight */}
      <div style={row}>
        <span style={label}>Weight</span>
        <select style={select} value={current.fontWeight || ''}
          onChange={(e) => setFieldStyle(selectedField, { fontWeight: e.target.value ? Number(e.target.value) : undefined })}>
          <option value="">Default</option>
          {FONT_WEIGHT_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {/* Spacing above / below */}
      <div style={{ ...row, flexDirection: 'row', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={label}>Space above</span>
          <select style={{ ...select, marginTop: 6 }} value={current.marginTop || ''}
            onChange={(e) => setFieldStyle(selectedField, { marginTop: e.target.value || undefined })}>
            <option value="">Default</option>
            {SPACING_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <span style={label}>Space below</span>
          <select style={{ ...select, marginTop: 6 }} value={current.marginBottom || ''}
            onChange={(e) => setFieldStyle(selectedField, { marginBottom: e.target.value || undefined })}>
            <option value="">Default</option>
            {SPACING_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Letter spacing */}
      <div style={row}>
        <span style={label}>Letter spacing</span>
        <select style={select} value={current.letterSpacing || ''}
          onChange={(e) => setFieldStyle(selectedField, { letterSpacing: e.target.value || undefined })}>
          <option value="">Default</option>
          {LETTER_SPACING_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Color */}
      <div style={row}>
        <span style={label}>Color</span>
        <div style={segGroup}>
          {COLOR_OPTIONS.map((c) => (
            <button key={c.value} title={c.label}
              onClick={() => setFieldStyle(selectedField, { color: current.color === c.value ? undefined : c.value })}
              style={{
                width: 26, height: 26, borderRadius: '50%', cursor: 'pointer',
                background: c.value,
                border: current.color === c.value ? '2px solid #34416D' : '1px solid rgba(52,65,109,0.25)',
                boxShadow: current.color === c.value ? '0 0 0 2px #fff inset' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Visibility */}
      <button
        onClick={() => toggleHidden(selectedField)}
        style={{
          width: '100%', marginTop: 4, padding: '9px 10px', borderRadius: 4, cursor: 'pointer',
          border: '1px solid rgba(52,65,109,0.18)', background: current.hidden ? '#34416D' : '#fff',
          color: current.hidden ? '#F5F3EF' : '#34416D', fontFamily: 'Inter, sans-serif',
          fontSize: 12, fontWeight: 700,
        }}
      >
        {current.hidden ? 'Show element' : 'Hide element'}
      </button>
    </div>
  );
}
