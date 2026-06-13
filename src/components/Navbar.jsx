import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { resolveSitePalette } from '../lib/presentationSchema';
import { useContent } from '../lib/useContent';
import { usePresentation } from '../lib/usePresentation';

const S = {
  nav: { fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s ease, background 0.2s ease', cursor: 'pointer', background: 'none', border: 'none', padding: '0.55rem 0.75rem', borderRadius: 3, display: 'flex', alignItems: 'center', gap: '0.25rem' },
};

// Brand light shell — keeps the original dark logo readable.
const NAV_BG = '#F5F3EF';   // Warm Off-White (brand background)
const NAV_TEXT = '#2C2C2C'; // Near Black (brand body text)
const NAV_HOVER = 'rgba(44,44,44,0.06)';

export default function Navbar() {
  const { content: cms } = useContent('site');
  const palette = resolveSitePalette(usePresentation('site'));
  const c = {
    brand_name: cms?.brand_name || 'PARADIGM',
    brand_descriptor: cms?.brand_descriptor || 'Asset Management',
    nav_institutions: cms?.nav_institutions || 'For Institutions',
    nav_process: cms?.nav_process || 'Our Process',
    nav_about: cms?.nav_about || 'About',
    nav_contact: cms?.nav_contact || 'Contact',
    direct_email: cms?.direct_email || 'jef@paradigmasset.com',
    direct_phone: cms?.direct_phone || '212.771.6100',
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobileAdvisorOpen, setMobileAdvisorOpen] = useState(false);
  const dropRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const fn = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 40;
          setScrolled(prev => prev === isScrolled ? prev : isScrolled);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileOpen]);

  const closeMenus = () => {
    setMobileOpen(false);
    setDropOpen(false);
    setMobileAdvisorOpen(false);
  };

  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const linkColor = (path) => {
    const active = location.pathname === path || (path === '/advisors' && ['/advisors', '/familyoffice'].includes(location.pathname));
    return active ? palette.accent : NAV_TEXT;
  };

  const rightLinks = [
    { label: c.nav_institutions, path: '/institutions' },
    { label: c.nav_process, path: '/process' },
    { label: c.nav_about, path: '/about' },
    { label: c.nav_contact, path: '/contact' },
  ];

  const mainMobileLinks = [
    { label: c.nav_institutions, path: '/institutions' },
    { label: c.nav_process, path: '/process' },
    { label: c.nav_about, path: '/about' },
    { label: c.nav_contact, path: '/contact' },
  ];

  return (
    <>
      {/* Floating pill navbar — stays same color, zooms out on scroll */}
      <nav
        className="floating-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: 'none',
          zIndex: 100,
          background: NAV_BG,
          backdropFilter: 'blur(20px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: '1px solid rgba(44,44,44,0.10)',
          borderRadius: 0,
          boxShadow: scrolled
            ? '0 8px 32px rgba(26,34,64,0.14), 0 0 0 1px rgba(196,162,91,0.10)'
            : '0 4px 24px rgba(26,34,64,0.08)',
          height: scrolled ? 'var(--nav-height-scrolled, 90px)' : 'var(--nav-height, 115px)',
          display: 'flex',
          alignItems: 'center',
          transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
          willChange: 'transform',
          overflow: 'visible',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 var(--nav-padding, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" onClick={closeMenus} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src="/Paradigm_PMS_Tag_Large.svg"
              alt="Paradigm Asset Management"
              style={{
                height: scrolled ? 'var(--logo-height-scrolled, 66px)' : 'var(--logo-height, 84px)',
                width: 'auto',
                flexShrink: 0,
                display: 'block',
                transition: 'height 0.3s ease',
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
            {/* Home — first item */}
            <Link
              to="/"
              onClick={closeMenus}
              style={{ ...S.nav, color: linkColor('/') }}
              onMouseEnter={e => e.currentTarget.style.background = NAV_HOVER}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Home
            </Link>

            {/* For Advisors dropdown */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(o => !o)}
                style={{ ...S.nav, color: linkColor('/advisors') }}
                onMouseEnter={e => e.currentTarget.style.background = NAV_HOVER}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                For Advisors <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 0.75rem)', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(52,65,109,0.95)', backdropFilter: 'blur(16px)',
                  borderRadius: 8, boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(245,243,239,0.1)', minWidth: 180, overflow: 'hidden',
                  animation: 'fadeDown 0.18s ease',
                }}>
                  <Link to="/advisors" onClick={closeMenus} style={{ display: 'block', padding: '0.875rem 1.25rem', fontFamily: 'Inter', fontSize: '1.125rem', fontWeight: 500, color: location.pathname === '/advisors' ? palette.accent : '#F5F3EF', textDecoration: 'none', borderBottom: '1px solid rgba(245,243,239,0.08)', letterSpacing: '0.04em' }}>
                    Wealth Advisors
                  </Link>
                  <Link to="/familyoffice" onClick={closeMenus} style={{ display: 'block', padding: '0.875rem 1.25rem', fontFamily: 'Inter', fontSize: '1.125rem', fontWeight: 500, color: location.pathname === '/familyoffice' ? palette.accent : '#F5F3EF', textDecoration: 'none', letterSpacing: '0.04em' }}>
                    Family Offices
                  </Link>
                </div>
              )}
            </div>

            {rightLinks.map(l => (
              <Link
                key={l.path}
                to={l.path}
                onClick={closeMenus}
                style={{ ...S.nav, color: linkColor(l.path) }}
                onMouseEnter={e => e.currentTarget.style.background = NAV_HOVER}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: 'rgba(44,44,44,0.06)', border: '1px solid rgba(44,44,44,0.15)', borderRadius: 50, cursor: 'pointer', color: NAV_TEXT, padding: '0.4rem', transition: 'all 0.3s' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Dropdown animation */}
      <style>{`@keyframes fadeDown { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: palette.tone,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)',
        willChange: 'transform',
        display: 'flex', flexDirection: 'column',
        paddingTop: 'calc(var(--nav-height, 70px) + 1rem)', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '2rem',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Home link */}
        <Link to="/" onClick={closeMenus}
          style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '1.625rem',
            fontWeight: 600,
            color: location.pathname === '/' ? palette.accent : '#F5F3EF',
            textDecoration: 'none',
            padding: '1rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          Home
          <ArrowUpRight size={18} style={{ color: palette.accent }} />
        </Link>

        {/* For Advisors — collapsible parent */}
        <button
          onClick={() => setMobileAdvisorOpen(o => !o)}
          style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '1.625rem',
            fontWeight: 600,
            color: ['/advisors', '/familyoffice'].includes(location.pathname) ? palette.accent : '#F5F3EF',
            textDecoration: 'none',
            padding: '1rem 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer', width: '100%', textAlign: 'left',
          }}
        >
          For Advisors
          <ChevronDown size={20} style={{ color: palette.accent, transition: 'transform 0.25s', transform: mobileAdvisorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>

        {mobileAdvisorOpen && (
          <div>
            {[
              { label: 'Wealth Advisors', path: '/advisors' },
              { label: 'Family Offices', path: '/familyoffice' },
            ].map((l) => (
              <Link key={l.path} to={l.path} onClick={closeMenus}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  color: location.pathname === l.path ? palette.accent : 'rgba(245,243,239,0.6)',
                  textDecoration: 'none',
                  padding: '0.875rem 0',
                  paddingLeft: '1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                {l.label}
                <ArrowUpRight size={16} style={{ color: palette.accent, opacity: 0.5 }} />
              </Link>
            ))}
          </div>
        )}

        {/* Main links */}
        {mainMobileLinks.map((l) => (
          <Link key={l.path} to={l.path} onClick={closeMenus}
            style={{
              fontFamily: 'Source Serif 4, serif',
              fontSize: '1.625rem',
              fontWeight: 600,
              color: location.pathname === l.path ? palette.accent : '#F5F3EF',
              textDecoration: 'none',
              padding: '1rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            {l.label}
            <ArrowUpRight size={18} style={{ color: palette.accent }} />
          </Link>
        ))}

        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: 'rgba(245,243,239,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Direct Contact</p>
          <a href={`mailto:${c.direct_email}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '1.0625rem', color: palette.accent, textDecoration: 'none', marginBottom: '0.25rem' }}>{c.direct_email}</a>
          <a href={`tel:${c.direct_phone.replace(/[^+\d]/g, '')}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '1.0625rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none', marginBottom: '0.15rem' }}>{c.direct_phone}</a>
          <a href="tel:9179913348" style={{ display: 'block', fontFamily: 'Inter', fontSize: '1.0625rem', color: 'rgba(245,243,239,0.4)', textDecoration: 'none' }}>917-991-3348</a>
        </div>
      </div>
    </>
  );
}
