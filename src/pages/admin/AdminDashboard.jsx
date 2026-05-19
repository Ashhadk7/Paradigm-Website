import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { invalidateContent } from '../../lib/useContent';

const PAGES = [
  {
    key: 'home',
    label: 'Home',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'trust_stat_1_value', label: 'Trust Strip — Stat 1 Value', type: 'text' },
      { name: 'trust_stat_1_label', label: 'Trust Strip — Stat 1 Label', type: 'text' },
      { name: 'trust_stat_2_value', label: 'Trust Strip — Stat 2 Value', type: 'text' },
      { name: 'trust_stat_2_label', label: 'Trust Strip — Stat 2 Label', type: 'text' },
      { name: 'trust_stat_3_value', label: 'Trust Strip — Stat 3 Value', type: 'text' },
      { name: 'trust_stat_3_label', label: 'Trust Strip — Stat 3 Label', type: 'text' },
      { name: 'trust_stat_3_sub', label: 'Trust Strip — Stat 3 Sub-label', type: 'text' },
      { name: 'trust_stat_4_value', label: 'Trust Strip — Stat 4 Value', type: 'text' },
      { name: 'trust_stat_4_label', label: 'Trust Strip — Stat 4 Label', type: 'text' },
      { name: 'trust_stat_5_value', label: 'Trust Strip — Stat 5 Value', type: 'text' },
      { name: 'trust_stat_5_label', label: 'Trust Strip — Stat 5 Label', type: 'text' },
      { name: 'platform_text', label: 'The Platform — Body Text', type: 'textarea' },
    ],
  },
  {
    key: 'advisors',
    label: 'For Advisors',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'platform_headline', label: 'Platform Capability — Headline', type: 'text' },
      { name: 'platform_para1', label: 'Platform Capability — Paragraph 1', type: 'textarea' },
      { name: 'platform_para2', label: 'Platform Capability — Paragraph 2', type: 'textarea' },
    ],
  },
  {
    key: 'familyoffice',
    label: 'For Family Offices',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'platform_ops_title', label: 'Platform Operations — Title', type: 'text' },
      { name: 'platform_ops_body', label: 'Platform Operations — Body', type: 'textarea' },
    ],
  },
  {
    key: 'institutions',
    label: 'For Institutions',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'hero_sub', label: 'Hero Subheading', type: 'textarea' },
      { name: 'platform_para1', label: 'The Platform — Paragraph 1', type: 'textarea' },
      { name: 'platform_para2', label: 'The Platform — Paragraph 2', type: 'textarea' },
    ],
  },
  {
    key: 'process',
    label: 'Our Process',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'data_foundation_text', label: 'Data Foundation — Body Text', type: 'textarea' },
      { name: 'step1_title', label: 'Step 01 — Title', type: 'text' },
      { name: 'step1_text', label: 'Step 01 — Body', type: 'textarea' },
      { name: 'step2_title', label: 'Step 02 — Title', type: 'text' },
      { name: 'step2_para1', label: 'Step 02 — Paragraph 1', type: 'textarea' },
      { name: 'step2_para2', label: 'Step 02 — Paragraph 2', type: 'textarea' },
      { name: 'step3_title', label: 'Step 03 — Title', type: 'text' },
      { name: 'step3_text', label: 'Step 03 — Body', type: 'textarea' },
      { name: 'step4_title', label: 'Step 04 — Title', type: 'text' },
      { name: 'step4_text', label: 'Step 04 — Body', type: 'textarea' },
    ],
  },
  {
    key: 'about',
    label: 'About',
    fields: [
      { name: 'hero_eyebrow', label: 'Hero Eyebrow', type: 'text' },
      { name: 'hero_headline', label: 'Hero Headline', type: 'textarea' },
      { name: 'james_title', label: 'James Francis — Title', type: 'text' },
      { name: 'james_bio_1', label: 'James Francis — Bio Paragraph 1', type: 'textarea' },
      { name: 'james_bio_2', label: 'James Francis — Bio Paragraph 2', type: 'textarea' },
      { name: 'james_bio_3', label: 'James Francis — Bio Paragraph 3', type: 'textarea' },
    ],
  },
];

export default function AdminDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('home');
  const [content, setContent] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const page = PAGES.find(p => p.key === activePage);

  useEffect(() => {
    loadContent();
  }, [activePage]);

  async function loadContent() {
    setLoading(true);
    setSaved(false);
    const { data } = await supabase
      .from('page_content')
      .select('content')
      .eq('page_key', activePage)
      .single();

    setContent(data?.content || {});
    setLoading(false);
  }

  function updateField(name, value) {
    setContent(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase
      .from('page_content')
      .upsert({
        page_key: activePage,
        content,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page_key' });

    if (!error) {
      invalidateContent(activePage);
      setSaved(true);
    }
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    onLogout();
  }

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoIcon}>P</div>
          <div>
            <div style={styles.logoTitle}>PARADIGM</div>
            <div style={styles.logoSub}>CMS</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <p style={styles.navLabel}>PAGES</p>
          {PAGES.map(p => (
            <button
              key={p.key}
              onClick={() => setActivePage(p.key)}
              style={{
                ...styles.navItem,
                ...(activePage === p.key ? styles.navItemActive : {}),
              }}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.pageTitle}>{page?.label}</h1>
          <div style={styles.topBarActions}>
            {saved && <span style={styles.savedBadge}>Saved</span>}
            <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {loading ? (
          <p style={styles.loadingText}>Loading...</p>
        ) : (
          <div style={styles.fields}>
            {page?.fields.map(field => (
              <div key={field.name} style={styles.fieldGroup}>
                <label style={styles.label}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={content[field.name] || ''}
                    onChange={e => updateField(field.name, e.target.value)}
                    style={styles.textarea}
                    rows={4}
                  />
                ) : (
                  <input
                    type="text"
                    value={content[field.name] || ''}
                    onChange={e => updateField(field.name, e.target.value)}
                    style={styles.input}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#F5F3EF',
  },
  sidebar: {
    width: 240,
    background: '#34416D',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 0',
    flexShrink: 0,
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0 1.25rem',
    marginBottom: '2rem',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(196,162,91,0.15)',
    color: '#C4A25B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  logoTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 800,
    fontSize: '0.75rem',
    letterSpacing: '0.12em',
    color: '#ffffff',
  },
  logoSub: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.5rem',
    letterSpacing: '0.14em',
    color: '#C4A25B',
    fontWeight: 600,
  },
  nav: {
    flex: 1,
  },
  navLabel: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.6rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.4)',
    padding: '0 1.25rem',
    marginBottom: '0.5rem',
  },
  navItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '0.6rem 1.25rem',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: 'rgba(196,162,91,0.15)',
    color: '#C4A25B',
    fontWeight: 600,
  },
  logoutBtn: {
    margin: '1rem 1.25rem 0',
    padding: '0.5rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: '2rem 3rem',
    overflowY: 'auto',
    maxHeight: '100vh',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(52,65,109,0.1)',
  },
  pageTitle: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '1.5rem',
    color: '#34416D',
  },
  topBarActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  savedBadge: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#27ae60',
    background: 'rgba(39,174,96,0.1)',
    padding: '0.35rem 0.75rem',
    borderRadius: '4px',
  },
  saveBtn: {
    padding: '0.6rem 1.5rem',
    background: '#C4A25B',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
  loadingText: {
    fontFamily: 'Inter, sans-serif',
    color: '#637890',
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    maxWidth: 720,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#34416D',
    letterSpacing: '0.02em',
  },
  input: {
    padding: '0.65rem 0.85rem',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.15)',
    borderRadius: '6px',
    outline: 'none',
    background: '#ffffff',
    color: '#2C2C2C',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '0.65rem 0.85rem',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.15)',
    borderRadius: '6px',
    outline: 'none',
    background: '#ffffff',
    color: '#2C2C2C',
    resize: 'vertical',
    lineHeight: 1.6,
    boxSizing: 'border-box',
  },
};
