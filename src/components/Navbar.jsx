import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { resolveSitePalette } from '../lib/presentationSchema';
import { useContent } from '../lib/useContent';
import { usePresentation } from '../lib/usePresentation';

const S = {
  nav: { fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textDecoration: 'none', textTransform: 'uppercase', transition: 'color 0.35s ease, background-color 0.35s ease, border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: '1px solid transparent', padding: '0.55rem 0.8rem', borderRadius: 999, display: 'flex', alignItems: 'center', gap: '0.35rem', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' },
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

  const linkColor = (path) => {
    const active = location.pathname === path || (path === '/advisors' && ['/advisors', '/familyoffice'].includes(location.pathname));
    return active ? palette.accent : '#F5F3EF';
  };

  const navItemStyle = (path) => {
    const active = location.pathname === path || (path === '/advisors' && ['/advisors', '/familyoffice'].includes(location.pathname));
    return {
      ...S.nav,
      color: active ? palette.accent : '#F5F3EF',
      background: active ? 'rgba(196,162,91,0.12)' : 'rgba(255,255,255,0.02)',
      borderColor: active ? 'rgba(196,162,91,0.2)' : 'rgba(255,255,255,0.08)',
      boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 10px 24px rgba(0,0,0,0.16)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
    };
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
      <nav
        className="floating-nav"
        style={{
          position: 'fixed',
          top: scrolled ? '0.6rem' : '1rem',
          left: '50%',
          width: scrolled ? '91%' : '95%',
          maxWidth: scrolled ? '1300px' : '1420px',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: mobileOpen
            ? 'linear-gradient(135deg, rgba(245,243,239,0.76) 0%, rgba(232,228,220,0.68) 100%)'
            : scrolled
              ? 'linear-gradient(135deg, rgba(32,40,71,0.74) 0%, rgba(52,65,109,0.62) 100%)'
              : 'linear-gradient(135deg, rgba(38,47,82,0.66) 0%, rgba(52,65,109,0.52) 100%)',
          backdropFilter: mobileOpen ? 'blur(26px) saturate(1.5)' : 'blur(22px) saturate(1.35)',
          WebkitBackdropFilter: mobileOpen ? 'blur(26px) saturate(1.5)' : 'blur(22px) saturate(1.35)',
          border: mobileOpen ? '1px solid rgba(196,162,91,0.18)' : '1px solid rgba(255,255,255,0.14)',
          borderRadius: mobileOpen ? 32 : (scrolled ? 28 : 18),
          boxShadow: mobileOpen
            ? '0 18px 45px rgba(52,65,109,0.16), inset 0 1px 0 rgba(255,255,255,0.34)'
            : scrolled
              ? '0 18px 48px rgba(8,12,24,0.32), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.03)'
              : '0 14px 40px rgba(8,12,24,0.24), inset 0 1px 0 rgba(255,255,255,0.1)',
          padding: scrolled ? '0.45rem 1.2rem' : '0.7rem 1.3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'top 0.55s cubic-bezier(0.22,1,0.36,1), width 0.55s cubic-bezier(0.22,1,0.36,1), max-width 0.55s cubic-bezier(0.22,1,0.36,1), padding 0.55s cubic-bezier(0.22,1,0.36,1), border-radius 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, background 0.4s ease, border-color 0.35s ease, backdrop-filter 0.4s ease',
          willChange: 'transform',
        }}
      >
          <Link to="/" onClick={closeMenus} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: scrolled ? 34 : 38,
              height: scrolled ? 34 : 38,
              background: 'linear-gradient(135deg, rgba(196,162,91,1) 0%, rgba(220,192,132,0.92) 100%)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 10px 24px rgba(196,162,91,0.28), inset 0 1px 0 rgba(255,255,255,0.35)',
              transition: 'width 0.4s ease, height 0.4s ease, border-radius 0.4s ease, box-shadow 0.35s ease',
            }}>
              <span style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: scrolled ? '1rem' : '1.1rem', color: '#34416D', lineHeight: 1, transition: 'font-size 0.35s ease' }}>P</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: scrolled ? '0.86rem' : '0.96rem', letterSpacing: '0.08em', color: mobileOpen ? '#2C2C2C' : '#F5F3EF', lineHeight: 1, transition: 'color 0.35s ease, font-size 0.35s ease' }}>{c.brand_name}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.5rem', letterSpacing: '0.2em', fontWeight: 600, textTransform: 'uppercase', color: mobileOpen ? 'rgba(44,44,44,0.5)' : 'rgba(245,243,239,0.58)', transition: 'color 0.35s ease', marginTop: 2 }}>{c.brand_descriptor}</div>
            </div>
          </Link>

          <div className="desktop-nav" style={{ alignItems: 'center', gap: '0.45rem' }}>
            <Link
              to="/"
              onClick={closeMenus}
              style={navItemStyle('/')}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                const active = location.pathname === '/';
                e.currentTarget.style.background = active ? 'rgba(196,162,91,0.12)' : 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = active ? 'rgba(196,162,91,0.2)' : 'rgba(255,255,255,0.08)';
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
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  const active = ['/advisors', '/familyoffice'].includes(location.pathname);
                  e.currentTarget.style.background = active ? 'rgba(196,162,91,0.12)' : 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = active ? 'rgba(196,162,91,0.2)' : 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                For Advisors <ChevronDown size={13} style={{ transition: 'transform 0.3s ease', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 0.85rem)', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(180deg, rgba(24,31,58,0.9) 0%, rgba(20,27,52,0.82) 100%)', backdropFilter: 'blur(20px) saturate(1.3)', WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
                  borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)', minWidth: 220, overflow: 'hidden',
                  animation: 'fadeDown 0.24s cubic-bezier(0.22,1,0.36,1)',
                }}>
                  <Link to="/advisors" onClick={closeMenus} style={{ display: 'block', padding: '0.95rem 1.2rem', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, color: location.pathname === '/advisors' ? palette.accent : '#F5F3EF', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'background 0.3s ease, color 0.3s ease' }}>
                    Wealth Advisors
                  </Link>
                  <Link to="/familyoffice" onClick={closeMenus} style={{ display: 'block', padding: '0.95rem 1.2rem', fontFamily: 'Inter', fontSize: '0.8rem', fontWeight: 600, color: location.pathname === '/familyoffice' ? palette.accent : '#F5F3EF', textDecoration: 'none', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'background 0.3s ease, color 0.3s ease' }}>
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
                  e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  const active = location.pathname === l.path;
                  e.currentTarget.style.background = active ? 'rgba(196,162,91,0.12)' : 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = active ? 'rgba(196,162,91,0.2)' : 'rgba(255,255,255,0.08)';
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
            style={{ background: mobileOpen ? 'rgba(44,44,44,0.08)' : 'rgba(255,255,255,0.08)', border: mobileOpen ? '1px solid rgba(44,44,44,0.12)' : '1px solid rgba(255,255,255,0.14)', borderRadius: 999, cursor: 'pointer', color: mobileOpen ? '#2C2C2C' : '#F5F3EF', padding: '0.55rem', alignItems: 'center', transition: 'all 0.35s ease', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: mobileOpen ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
      </nav>

      <style>{`@keyframes fadeDown { from { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }`}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: 'linear-gradient(180deg, rgba(27,35,65,0.78) 0%, rgba(18,24,45,0.92) 100%)',
        backdropFilter: 'blur(26px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(26px) saturate(1.2)',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        opacity: mobileOpen ? 1 : 0,
        pointerEvents: mobileOpen ? 'auto' : 'none',
        transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
        willChange: 'transform',
        display: 'flex', flexDirection: 'column',
        paddingTop: '6rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '2rem',
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
              color: location.pathname === '/' ? palette.accent : '#F5F3EF',
              textDecoration: 'none',
              padding: '1rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'color 0.3s ease',
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
              color: ['/advisors', '/familyoffice'].includes(location.pathname) ? palette.accent : '#F5F3EF',
              textDecoration: 'none',
              padding: '1rem 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'none', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer', width: '100%', textAlign: 'left',
              transition: 'color 0.3s ease',
            }}
          >
            For Advisors
            <ChevronDown size={20} style={{ color: palette.accent, transition: 'transform 0.3s ease', transform: mobileAdvisorOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          <div style={{
            maxHeight: mobileAdvisorOpen ? '240px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}>
            <div>
              {[
                { label: 'Wealth Advisors', path: '/advisors' },
                { label: 'Family Offices', path: '/familyoffice' },
              ].map((l) => (
                <Link key={l.path} to={l.path} onClick={closeMenus}
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: location.pathname === l.path ? palette.accent : 'rgba(245,243,239,0.72)',
                    textDecoration: 'none',
                    padding: '0.875rem 0',
                    paddingLeft: '1.25rem',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    textTransform: 'uppercase',
                  }}
                >
                  {l.label}
                  <ArrowUpRight size={16} style={{ color: palette.accent, opacity: 0.5 }} />
                </Link>
              ))}
            </div>
          </div>

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
                transition: 'color 0.3s ease',
              }}
            >
              {l.label}
              <ArrowUpRight size={18} style={{ color: palette.accent }} />
            </Link>
          ))}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(245,243,239,0.42)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Direct Contact</p>
            <a href={`mailto:${c.direct_email}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.95rem', color: palette.accent, textDecoration: 'none', marginBottom: '0.35rem' }}>{c.direct_email}</a>
            <a href={`tel:${c.direct_phone.replace(/[^+\d]/g, '')}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.95rem', color: 'rgba(245,243,239,0.72)', textDecoration: 'none', marginBottom: '0.15rem' }}>{c.direct_phone}</a>
            <a href="tel:9179913348" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.8125rem', color: 'rgba(245,243,239,0.42)', textDecoration: 'none' }}>917-991-3348</a>
          </div>
        </div>
      </div>
    </>
  );
}
