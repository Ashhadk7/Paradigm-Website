import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { EditModeProvider } from './lib/useEditMode';
import { useEditMode } from './lib/editModeContext';
import EditToolbar from './components/cms/EditToolbar';
import StylePopover from './components/cms/StylePopover';
import Home from './pages/Home';
import Advisors from './pages/Advisors';
import FamilyOffice from './pages/FamilyOffice';
import Institutions from './pages/Institutions';
import Process from './pages/Process';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Admin from './pages/admin/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Turns on edit mode when an authorized admin visits any page with ?edit=1.
function EditModeActivator() {
  const [searchParams] = useSearchParams();
  const { authorized, checkingAuth, editing, setEditing } = useEditMode();
  const wantsEdit = searchParams.get('edit') === '1';

  useEffect(() => {
    if (!checkingAuth && wantsEdit && authorized && !editing) {
      setEditing(true);
    }
  }, [checkingAuth, wantsEdit, authorized, editing, setEditing]);

  return null;
}

function Layout() {
  const { editing } = useEditMode();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <EditModeActivator />
      <EditToolbar />
      <StylePopover />
      <Navbar />
      <ScrollToTop />
      <main style={{ flex: 1, paddingTop: editing ? 56 : undefined }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/advisors" element={<Advisors />} />
          <Route path="/familyoffice" element={<FamilyOffice />} />
          <Route path="/familyoffices" element={<FamilyOffice />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/process" element={<Process />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <EditModeProvider>
        <Router>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route path="/*" element={<Layout />} />
          </Routes>
        </Router>
      </EditModeProvider>
    </HelmetProvider>
  );
}
