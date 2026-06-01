import { createContext, useContext } from 'react';

// Context + hook for the visual edit mode. Kept separate from the provider
// component file so each module has a single export concern (satisfies
// react-refresh/only-export-components and keeps fast refresh working).

export const EditModeContext = createContext(null);

const INERT = {
  editing: false, authorized: false, checkingAuth: false,
  pageKey: null, draft: null, dirty: false, saving: false,
  selectedField: null, setSelectedField: () => {},
  setEditing: () => {}, exitEditing: () => {},
  registerPage: () => {},
  setFieldText: () => {}, setFieldStyle: () => {}, toggleHidden: () => {},
  save: async () => ({ ok: false }), discard: () => {},
};

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  // Allow use outside the provider (e.g. isolated rendering) without crashing.
  return ctx || INERT;
}
