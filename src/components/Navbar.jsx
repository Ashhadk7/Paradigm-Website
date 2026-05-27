import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { resolveSitePalette } from '../lib/presentationSchema';
import { useContent } from '../lib/useContent';
import { usePresentation } from '../lib/usePresentation';

const S = {
  nav: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.74rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textDecoration: 'none',
    textTransform: 'uppercase',
    transition: 'color 0.3s ease, background 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    background: 'none',
    border: '1px solid transparent',
    padding: '0.5rem 0.75rem',
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
};

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

  const isActivePath = (path) => location.pathname === path || (path === '/advisors' && ['/advisors', '/familyoffice'].includes(location.pathname));

  const linkColor = (path) => {
    const active = isActivePath(path);
    return active ? '#FFFFFF' : 'rgba(245,243,239,0.84)';
  };

  const navItemStyle = (path) => ({
    ...S.nav,
    color: linkColor(path),
    background: isActivePath(path) ? 'rgba(255,255,255,0.14)' : 'transparent',
    borderColor: isActivePath(path) ? 'rgba(255,255,255,0.14)' : 'transparent',
    boxShadow: isActivePath(path) ? 'inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
  });

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
      <nav
        className="floating-nav"
        style={{
          position: 'fixed',
          top: scrolled ? '0.6rem' : '0.95rem',
          left: '50%',
          width: scrolled ? '91%' : '95.5%',
          maxWidth: scrolled ? '1280px' : '1400px',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: scrolled
            ? 'linear-gradient(180deg, rgba(31,39,71,0.74) 0%, rgba(20,27,51,0.62) 100%)'
            : 'linear-gradient(180deg, rgba(31,39,71,0.58) 0%, rgba(20,27,51,0.46) 100%)',
          backdropFilter: 'blur(24px) saturate(1.35)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.35)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: scrolled ? 24 : 28,
          boxShadow: scrolled
            ? '0 18px 44px rgba(8,12,24,0.28), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(196,162,91,0.05)'
            : '0 14px 38px rgba(8,12,24,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: scrolled ? '0.5rem 1.1rem' : '0.68rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'top 0.55s cubic-bezier(0.22,1,0.36,1), width 0.55s cubic-bezier(0.22,1,0.36,1), max-width 0.55s cubic-bezier(0.22,1,0.36,1), padding 0.5s cubic-bezier(0.22,1,0.36,1), border-radius 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, background 0.4s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
          willChange: 'transform',
          overflow: 'visible',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 28%, rgba(255,255,255,0.02) 100%)',
            pointerEvents: 'none',
          }}
        />

        <Link to="/" onClick={closeMenus} style={{ display: 'flex', alignItems: 'center', gap: '0.72rem', textDecoration: 'none', flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <div style={{
            width: scrolled ? 34 : 38,
            height: scrolled ? 34 : 38,
            background: 'linear-gradient(135deg, rgba(196,162,91,1) 0%, rgba(214,184,120,1) 100%)',
            borderRadius: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 10px 24px rgba(196,162,91,0.22), inset 0 1px 0 rgba(255,255,255,0.45)',
            border: '1px solid rgba(255,255,255,0.28)',
            transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1), height 0.4s cubic-bezier(0.22,1,0.36,1), border-radius 0.4s ease, box-shadow 0.35s ease',
          }}>
            <span style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: scrolled ? '1rem' : '1.08rem', color: '#34416D', lineHeight: 1, transition: 'font-size 0.35s ease' }}>P</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: scrolled ? '0.87rem' : '0.96rem', letterSpacing: '0.08em', color: '#F5F3EF', lineHeight: 1, transition: 'font-size 0.35s ease, opacity 0.35s ease' }}>{c.brand_name}</div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.5rem', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', color: 'rgba(245,243,239,0.58)', transition: 'color 0.3s', marginTop: 2 }}>{c.brand_descriptor}</div>
          </div>
        </Link>

        <div className="desktop-nav" style={{ alignItems: 'center', gap: '0.25rem', position: 'relative', zIndex: 1 }}>
          <Link
            to="/"
            onClick={closeMenus}
            style={navItemStyle('/')}
            onMouseEnter={e => {
              e.currentTarget.style.background = isActivePath('/') ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.09)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = isActivePath('/') ? 'rgba(255,255,255,0.14)' : 'transparent';
              e.currentTarget.style.borderColor = isActivePath('/') ? 'rgba(255,255,255,0.14)' : 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Home
          </Link>

          <div ref={dropRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropOpen(o => !o)}
              style={navItemStyle('/advisors')}
              onMouseEnter={e => {
                e.currentTarget.style.background = isActivePath('/advisors') ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.09)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isActivePath('/advisors') ? 'rgba(255,255,255,0.14)' : 'transparent';
                e.currentTarget.style.borderColor = isActivePath('/advisors') ? 'rgba(255,255,255,0.14)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              For Advisors <ChevronDown size={13} style={{ transition: 'transform 0.3s ease', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {dropOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 0.85rem)',
                left: '50%',
                transform: 'translateX(-50%)',
                minWidth: 220,
                padding: '0.45rem',
                background: 'linear-gradient(180deg, rgba(23,31,58,0.84) 0%, rgba(18,25,47,0.76) 100%)',
                backdropFilter: 'blur(22px) saturate(1.35)',
                WebkitBackdropFilter: 'blur(22px) saturate(1.35)',
                borderRadius: 18,
                boxShadow: '0 20px 48px rgba(7,12,24,0.32), inset 0 1px 0 rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                overflow: 'hidden',
                animation: 'fadeDownGlass 0.24s cubic-bezier(0.22,1,0.36,1)',
              }}>
                <Link to="/advisors" onClick={closeMenus} style={{ display: 'block', padding: '0.9rem 1rem', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, color: location.pathname === '/advisors' ? '#FFFFFF' : 'rgba(245,243,239,0.82)', textDecoration: 'none', borderRadius: 12, letterSpacing: '0.05em', textTransform: 'uppercase', background: location.pathname === '/advisors' ? 'rgba(255,255,255,0.12)' : 'transparent', border: `1px solid ${location.pathname === '/advisors' ? 'rgba(255,255,255,0.1)' : 'transparent'}`, transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease' }}>
                  Wealth Advisors
                </Link>
                <Link to="/familyoffice" onClick={closeMenus} style={{ display: 'block', padding: '0.9rem 1rem', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, color: location.pathname === '/familyoffice' ? '#FFFFFF' : 'rgba(245,243,239,0.82)', textDecoration: 'none', borderRadius: 12, letterSpacing: '0.05em', textTransform: 'uppercase', background: location.pathname === '/familyoffice' ? 'rgba(255,255,255,0.12)' : 'transparent', border: `1px solid ${location.pathname === '/familyoffice' ? 'rgba(255,255,255,0.1)' : 'transparent'}`, transition: 'background 0.25s ease, border-color 0.25s ease, color 0.25s ease' }}>
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
              style={navItemStyle(l.path)}
              onMouseEnter={e => {
                e.currentTarget.style.background = isActivePath(l.path) ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.09)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isActivePath(l.path) ? 'rgba(255,255,255,0.14)' : 'transparent';
                e.currentTarget.style.borderColor = isActivePath(l.path) ? 'rgba(255,255,255,0.14)' : 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(o => !o)}
          style={{
            background: mobileOpen ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 999,
            cursor: 'pointer',
            color: '#F5F3EF',
            padding: '0.52rem',
            alignItems: 'center',
            transition: 'all 0.35s ease',
            boxShadow: mobileOpen ? 'inset 0 1px 0 rgba(255,255,255,0.08)' : 'none',
            position: 'relative',
            zIndex: 1,
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <style>{`@keyframes fadeDownGlass { from { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }`}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99,
        background: 'linear-gradient(180deg, rgba(20,27,51,0.86) 0%, rgba(13,18,36,0.92) 100%)',
        backdropFilter: 'blur(26px) saturate(1.25)',
        WebkitBackdropFilter: 'blur(26px) saturate(1.25)',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        opacity: mobileOpen ? 1 : 0.96,
        transition: 'transform 0.48s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
        willChange: 'transform',
        display: 'flex', flexDirection: 'column',
        paddingTop: '6.25rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '1.5rem',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
      }}>
        <div style={{ maxWidth: 720, width: '100%', margin: '0 auto' }}>
          <Link to="/" onClick={closeMenus}
            style={{
              fontFamily: 'Source Serif 4, serif',
              fontSize: '1.625rem',
              fontWeight: 600,
              color: location.pathname === '/' ? '#FFFFFF' : '#F5F3EF',
              textDecoration: 'none',
              padding: '1rem 1.1rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: location.pathname === '/' ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderRadius: 18,
              marginBottom: '0.45rem',
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
          >
            Home
            <ArrowUpRight size={18} style={{ color: palette.accent }} />
          </Link>

          <button
            onClick={() => setMobileAdvisorOpen(o => !o)}
            style={{
              fontFamily: 'Source Serif 4, serif',
              fontSize: '1.625rem',
              fontWeight: 600,
              color: ['/advisors', '/familyoffice'].includes(location.pathname) ? '#FFFFFF' : '#F5F3EF',
              textDecoration: 'none',
              padding: '1rem 1.1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: ['/advisors', '/familyoffice'].includes(location.pathname) || mobileAdvisorOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
              borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer', width: '100%', textAlign: 'left',
              borderRadius: 18,
              marginBottom: '0.45rem',
              transition: 'background 0.3s ease, color 0.3s ease',
            }}
          >
            For Advisors
            <ChevronDown size={20} style={{ color: palette.accent, transition: 'transform 0.3s ease', transform: mobileAdvisorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {mobileAdvisorOpen && (
            <div style={{ marginTop: '-0.1rem', marginBottom: '0.45rem', padding: '0.35rem 0.35rem 0.2rem', borderRadius: 18, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Wealth Advisors', path: '/advisors' },
                { label: 'Family Offices', path: '/familyoffice' },
              ].map((l) => (
                <Link key={l.path} to={l.path} onClick={closeMenus}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: location.pathname === l.path ? '#FFFFFF' : 'rgba(245,243,239,0.7)',
                    textDecoration: 'none',
                    padding: '0.95rem 0.9rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: location.pathname === l.path ? 'rgba(255,255,255,0.08)' : 'transparent',
                    borderRadius: 14,
                    marginBottom: '0.2rem',
                  }}
                >
                  {l.label}
                  <ArrowUpRight size={16} style={{ color: palette.accent, opacity: 0.7 }} />
                </Link>
              ))}
            </div>
          )}

          {mainMobileLinks.map((l) => (
            <Link key={l.path} to={l.path} onClick={closeMenus}
              style={{
                fontFamily: 'Source Serif 4, serif',
                fontSize: '1.625rem',
                fontWeight: 600,
                color: location.pathname === l.path ? '#FFFFFF' : '#F5F3EF',
                textDecoration: 'none',
                padding: '1rem 1.1rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: location.pathname === l.path ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderRadius: 18,
                marginBottom: '0.45rem',
                transition: 'background 0.3s ease, color 0.3s ease',
              }}
            >
              {l.label}
              <ArrowUpRight size={18} style={{ color: palette.accent }} />
            </Link>
          ))}

          <div style={{ marginTop: '2rem', padding: '1.25rem 1.1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(245,243,239,0.42)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Direct Contact</p>
            <a href={`mailto:${c.direct_email}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.95rem', color: palette.accent, textDecoration: 'none', marginBottom: '0.35rem' }}>{c.direct_email}</a>
            <a href={`tel:${c.direct_phone.replace(/[^+\d]/g, '')}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.95rem', color: 'rgba(245,243,239,0.74)', textDecoration: 'none', marginBottom: '0.2rem' }}>{c.direct_phone}</a>
            <a href="tel:9179913348" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.8125rem', color: 'rgba(245,243,239,0.46)', textDecoration: 'none' }}>917-991-3348</a>
          </div>
        </div>
      </div>
    </>
  );
}
