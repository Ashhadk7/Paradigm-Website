import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';

const S = {
  nav: { fontFamily: 'Inter, sans-serif', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.2s ease, background 0.2s ease', cursor: 'pointer', background: 'none', border: 'none', padding: '0.45rem 0.6rem', borderRadius: 3, display: 'flex', alignItems: 'center', gap: '0.25rem' },
};

export default function Navbar() {
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
    return active ? '#C4A25B' : '#F5F3EF';
  };

  const rightLinks = [
    { label: 'For Institutions', path: '/institutions' },
    { label: 'Our Process', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const mainMobileLinks = [
    { label: 'For Institutions', path: '/institutions' },
    { label: 'Our Process', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  // Zoom-out scale: starts at 1, shrinks to 0.92 on scroll
  const navScale = scrolled ? 0.92 : 1;

  return (
    <>
      {/* Floating pill navbar — stays same color, zooms out on scroll */}
      <nav
        className="floating-nav"
        style={{
          position: 'fixed',
          top: scrolled ? '0.5rem' : '0.85rem',
          left: '50%',
          width: scrolled ? '92%' : '96%',
          maxWidth: scrolled ? '1320px' : '1440px',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: mobileOpen ? 'rgba(232,228,220,0.65)' : 'rgba(26,34,64,0.82)',
          backdropFilter: mobileOpen ? 'blur(24px) saturate(1.4)' : 'blur(20px)',
          WebkitBackdropFilter: mobileOpen ? 'blur(24px) saturate(1.4)' : 'blur(20px)',
          border: mobileOpen ? '1px solid rgba(196,162,91,0.18)' : '1px solid rgba(245,243,239,0.12)',
          borderRadius: mobileOpen ? 50 : (scrolled ? 50 : 10),
          boxShadow: mobileOpen
            ? '0 8px 32px rgba(52,65,109,0.12), inset 0 1px 0 rgba(255,255,255,0.3)'
            : scrolled
              ? '0 8px 32px rgba(0,0,0,0.28), 0 0 0 1px rgba(196,162,91,0.08)'
              : '0 4px 24px rgba(0,0,0,0.18)',
          padding: scrolled ? '0.35rem 1.25rem' : '0.55rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'top 0.4s cubic-bezier(0.4,0,0.2,1), width 0.4s cubic-bezier(0.4,0,0.2,1), max-width 0.4s cubic-bezier(0.4,0,0.2,1), padding 0.4s cubic-bezier(0.4,0,0.2,1), border-radius 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
          willChange: 'transform',
        }}
      >
          {/* Logo */}
          <Link to="/" onClick={closeMenus} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: scrolled ? 30 : 34,
              height: scrolled ? 30 : 34,
              background: '#C4A25B',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'width 0.3s, height 0.3s',
            }}>
              <span style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: scrolled ? '0.95rem' : '1.05rem', color: '#34416D', lineHeight: 1, transition: 'font-size 0.3s' }}>P</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: scrolled ? '0.85rem' : '0.9375rem', letterSpacing: '0.06em', color: mobileOpen ? '#2C2C2C' : '#F5F3EF', lineHeight: 1, transition: 'color 0.3s, font-size 0.3s' }}>PARADIGM</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.5rem', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', color: mobileOpen ? 'rgba(44,44,44,0.5)' : 'rgba(245,243,239,0.55)', transition: 'color 0.3s', marginTop: 1 }}>Asset Management</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ alignItems: 'center', gap: '0.15rem' }}>
            {/* Home — first item */}
            <Link
              to="/"
              onClick={closeMenus}
              style={{ ...S.nav, color: linkColor('/') }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,243,239,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Home
            </Link>

            {/* For Advisors dropdown */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(o => !o)}
                style={{ ...S.nav, color: linkColor('/advisors') }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,243,239,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                For Advisors <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 0.75rem)', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(26,34,64,0.95)', backdropFilter: 'blur(16px)',
                  borderRadius: 8, boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                  border: '1px solid rgba(245,243,239,0.1)', minWidth: 180, overflow: 'hidden',
                  animation: 'fadeDown 0.18s ease',
                }}>
                  <Link to="/advisors" onClick={closeMenus} style={{ display: 'block', padding: '0.875rem 1.25rem', fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 500, color: location.pathname === '/advisors' ? '#C4A25B' : '#F5F3EF', textDecoration: 'none', borderBottom: '1px solid rgba(245,243,239,0.08)', letterSpacing: '0.04em' }}>
                    Wealth Advisors
                  </Link>
                  <Link to="/familyoffice" onClick={closeMenus} style={{ display: 'block', padding: '0.875rem 1.25rem', fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 500, color: location.pathname === '/familyoffice' ? '#C4A25B' : '#F5F3EF', textDecoration: 'none', letterSpacing: '0.04em' }}>
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
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,243,239,0.1)'}
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
            style={{ background: mobileOpen ? 'rgba(44,44,44,0.08)' : 'rgba(245,243,239,0.1)', border: mobileOpen ? '1px solid rgba(44,44,44,0.15)' : '1px solid rgba(245,243,239,0.15)', borderRadius: 50, cursor: 'pointer', color: mobileOpen ? '#2C2C2C' : '#F5F3EF', padding: '0.4rem', alignItems: 'center', transition: 'all 0.3s' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </nav>

      {/* Dropdown animation */}
      <style>{`@keyframes fadeDown { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: '#1a2240',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)',
        willChange: 'transform',
        display: 'flex', flexDirection: 'column',
        paddingTop: '5.5rem', paddingLeft: '2rem', paddingRight: '2rem',
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
            color: location.pathname === '/' ? '#C4A25B' : '#F5F3EF',
            textDecoration: 'none',
            padding: '1rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          Home
          <ArrowUpRight size={18} style={{ color: '#C4A25B' }} />
        </Link>

        {/* For Advisors — collapsible parent */}
        <button
          onClick={() => setMobileAdvisorOpen(o => !o)}
          style={{
            fontFamily: 'Source Serif 4, serif',
            fontSize: '1.625rem',
            fontWeight: 600,
            color: ['/advisors', '/familyoffice'].includes(location.pathname) ? '#C4A25B' : '#F5F3EF',
            textDecoration: 'none',
            padding: '1rem 0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer', width: '100%', textAlign: 'left',
          }}
        >
          For Advisors
          <ChevronDown size={20} style={{ color: '#C4A25B', transition: 'transform 0.25s', transform: mobileAdvisorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
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
                  color: location.pathname === l.path ? '#C4A25B' : 'rgba(245,243,239,0.6)',
                  textDecoration: 'none',
                  padding: '0.875rem 0',
                  paddingLeft: '1.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                {l.label}
                <ArrowUpRight size={16} style={{ color: '#C4A25B', opacity: 0.5 }} />
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
              color: location.pathname === l.path ? '#C4A25B' : '#F5F3EF',
              textDecoration: 'none',
              padding: '1rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            {l.label}
            <ArrowUpRight size={18} style={{ color: '#C4A25B' }} />
          </Link>
        ))}

        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(245,243,239,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Direct Contact</p>
          <a href="mailto:jef@paradigmasset.com" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.9375rem', color: '#C4A25B', textDecoration: 'none', marginBottom: '0.25rem' }}>jef@paradigmasset.com</a>
          <a href="tel:2127716100" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.9375rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none', marginBottom: '0.15rem' }}>212.771.6100</a>
          <a href="tel:9179913348" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.8125rem', color: 'rgba(245,243,239,0.4)', textDecoration: 'none' }}>917-991-3348</a>
        </div>
      </div>
    </>
  );
}
