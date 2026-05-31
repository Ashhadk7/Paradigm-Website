import { useRef } from 'react';
import { useEditMode } from '../../lib/editModeContext';
import { mergeStyle, isHidden } from '../../lib/elementStyles';

// Wraps a single editable element. In normal render it applies any saved style
// override (and hides the element if flagged). In edit mode it adds a selection
// outline, click-to-select, and inline text editing (plain contentEditable).
//
// Props:
//   field        — the content field key (e.g. "hero_headline")
//   as           — element/tag to render ('h1', 'p', 'span', ...) default 'div'
//   styleSource  — the content object to read overrides from on PUBLIC render
//                  (the page passes the cms/draft content here). In edit mode the
//                  provider's draft is the source of truth.
//   baseStyle    — the element's normal inline style object
//   editableText — if false, the element is selectable/stylable but not text-edited
//                  (use for groups/containers). Default true.
//   children     — the text/content to render when not editing inline.
export default function Editable({
  field,
  as: Tag = 'div',
  styleSource,
  baseStyle = {},
  editableText = true,
  multiline = false,
  className,
  children,
  ...rest
}) {
  const {
    editing, draft, selectedField, setSelectedField, setFieldText,
  } = useEditMode();
  const ref = useRef(null);

  // In edit mode the draft is authoritative; on public render use the page's content.
  const source = editing && draft ? draft : (styleSource || {});

  if (isHidden(source, field) && !editing) {
    return null;
  }

  const mergedStyle = mergeStyle(baseStyle, source, field);
  const hidden = isHidden(source, field);

  // ---- Public (non-editing) render: behave exactly like a normal element ----
  if (!editing) {
    return (
      <Tag className={className} style={mergedStyle} {...rest}>
        {children}
      </Tag>
    );
  }

  // ---- Edit mode render ----
  const selected = selectedField === field;

  const editStyle = {
    ...mergedStyle,
    outline: selected ? '2px solid #C4A25B' : '1px dashed rgba(196,162,91,0.55)',
    outlineOffset: '3px',
    cursor: 'text',
    borderRadius: 2,
    opacity: hidden ? 0.35 : mergedStyle.opacity,
    position: 'relative',
    transition: 'outline-color 0.15s ease',
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedField(field);
  };

  const handleBlur = (e) => {
    if (!editableText) return;
    const text = e.currentTarget.innerText.replace(/\n$/, '');
    if (text !== (source[field] ?? '')) {
      setFieldText(field, text);
    }
  };

  // Single-line fields: Enter commits (blur). Multiline fields: Enter inserts a
  // newline as normal; Escape commits.
  const handleKeyDown = (e) => {
    if (multiline) {
      if (e.key === 'Escape') { e.preventDefault(); e.currentTarget.blur(); }
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      className={className}
      style={editStyle}
      onClick={handleClick}
      data-cms-field={field}
      contentEditable={editableText ? true : undefined}
      suppressContentEditableWarning={editableText ? true : undefined}
      onBlur={editableText ? handleBlur : undefined}
      onKeyDown={editableText ? handleKeyDown : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
