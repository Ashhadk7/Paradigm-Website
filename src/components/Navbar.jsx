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
  const dropRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const closeMenus = () => {
    setMobileOpen(false);
    setDropOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const linkColor = (path) => {
    const active = location.pathname === path || (path === '/advisors' && ['/advisors', '/familyoffice'].includes(location.pathname));
    return active ? '#C4A25B' : scrolled ? '#253052' : '#F5F3EF';
  };

  const rightLinks = [
    { label: 'For Institutions', path: '/institutions' },
    { label: 'Our Process', path: '/process' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          transition: 'background 0.3s ease, box-shadow 0.3s ease, padding 0.3s ease, border-color 0.3s ease',
          background: scrolled ? 'rgba(245,243,239,0.96)' : 'rgba(26,34,64,0.74)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: scrolled ? '1px solid rgba(52,65,109,0.12)' : '1px solid rgba(245,243,239,0.16)',
          boxShadow: scrolled ? '0 12px 30px rgba(26,34,64,0.08)' : '0 1px 0 rgba(255,255,255,0.05)',
          paddingTop: scrolled ? '0.65rem' : '0.85rem',
          paddingBottom: scrolled ? '0.65rem' : '0.85rem',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: '#C4A25B', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 8px 18px rgba(0,0,0,0.14)' }}>
              <span style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: '1.125rem', color: '#34416D', lineHeight: 1 }}>P</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', color: scrolled ? '#34416D' : '#F5F3EF', transition: 'color 0.3s', lineHeight: 1 }}>PARADIGM</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.56rem', letterSpacing: '0.18em', fontWeight: 600, textTransform: 'uppercase', color: scrolled ? '#637890' : 'rgba(245,243,239,0.68)', transition: 'color 0.3s', marginTop: 2 }}>Asset Management</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.45rem', padding: '0.35rem', borderRadius: 4, background: scrolled ? 'rgba(52,65,109,0.04)' : 'rgba(245,243,239,0.08)', border: scrolled ? '1px solid rgba(52,65,109,0.08)' : '1px solid rgba(245,243,239,0.13)' }}>

            {/* For Advisors dropdown */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropOpen(o => !o)}
                style={{ ...S.nav, color: linkColor('/advisors') }}
                onMouseEnter={e => e.currentTarget.style.background = scrolled ? 'rgba(52,65,109,0.07)' : 'rgba(245,243,239,0.11)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                For Advisors <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              {dropOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 0.75rem)', left: '50%', transform: 'translateX(-50%)',
                  background: '#fff', borderRadius: 4, boxShadow: '0 8px 32px rgba(52,65,109,0.14)',
                  border: '1px solid rgba(52,65,109,0.08)', minWidth: 180, overflow: 'hidden',
                  animation: 'fadeDown 0.18s ease',
                }}>
                  <Link to="/advisors" onClick={closeMenus} style={{ display: 'block', padding: '0.875rem 1.25rem', fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 500, color: location.pathname === '/advisors' ? '#C4A25B' : '#34416D', textDecoration: 'none', borderBottom: '1px solid rgba(52,65,109,0.06)', letterSpacing: '0.04em' }}>
                    Wealth Advisors
                  </Link>
                  <Link to="/familyoffice" onClick={closeMenus} style={{ display: 'block', padding: '0.875rem 1.25rem', fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 500, color: location.pathname === '/familyoffice' ? '#C4A25B' : '#34416D', textDecoration: 'none', letterSpacing: '0.04em' }}>
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
                onMouseEnter={e => e.currentTarget.style.background = scrolled ? 'rgba(52,65,109,0.07)' : 'rgba(245,243,239,0.11)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(o => !o)}
            style={{ background: scrolled ? 'rgba(52,65,109,0.08)' : 'rgba(245,243,239,0.12)', border: scrolled ? '1px solid rgba(52,65,109,0.12)' : '1px solid rgba(245,243,239,0.18)', borderRadius: 3, cursor: 'pointer', color: scrolled ? '#34416D' : '#F5F3EF', padding: '0.45rem', display: 'flex', alignItems: 'center' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Dropdown animation */}
      <style>{`@keyframes fadeDown { from { opacity: 0; transform: translateX(-50%) translateY(-6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>

      {/* Mobile Drawer */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: '#34416D',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        paddingTop: '5.5rem', paddingLeft: '2rem', paddingRight: '2rem',
        overflowY: 'auto',
      }}>
        {[
          { label: 'Wealth Advisors', path: '/advisors', secondary: true },
          { label: 'Family Offices', path: '/familyoffice', secondary: true },
          { label: 'For Institutions', path: '/institutions' },
          { label: 'Our Process', path: '/process' },
          { label: 'About', path: '/about' },
          { label: 'Contact', path: '/contact' },
        ].map((l) => (
          <Link key={l.path} to={l.path} onClick={closeMenus}
            style={{
              fontFamily: l.secondary ? 'Inter, sans-serif' : 'Source Serif 4, serif',
              fontSize: l.secondary ? '1.1rem' : '1.625rem',
              fontWeight: 600,
              color: location.pathname === l.path ? '#C4A25B' : l.secondary ? 'rgba(245,243,239,0.6)' : '#F5F3EF',
              textDecoration: 'none',
              padding: `${l.secondary ? '0.875rem' : '1rem'} 0`,
              paddingLeft: l.secondary ? '1.5rem' : '0',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
          >
            {l.label}
            <ArrowUpRight size={18} style={{ color: '#C4A25B' }} />
          </Link>
        ))}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: 'rgba(245,243,239,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>Direct Contact</p>
          <a href="mailto:jef@paradigmasset.com" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.9375rem', color: '#C4A25B', textDecoration: 'none', marginBottom: '0.25rem' }}>jef@paradigmasset.com</a>
          <a href="tel:2127716100" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.9375rem', color: 'rgba(245,243,239,0.6)', textDecoration: 'none', marginBottom: '0.15rem' }}>212.771.6100</a>
          <a href="tel:9179913348" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.8125rem', color: 'rgba(245,243,239,0.4)', textDecoration: 'none' }}>917-991-3348</a>
        </div>
      </div>
    </>
  );
}
