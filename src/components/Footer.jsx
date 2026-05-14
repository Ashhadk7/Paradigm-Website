import { Link } from 'react-router-dom';

export default function Footer() {
  const linkStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    color: 'rgba(245,243,239,0.6)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const separatorStyle = {
    color: 'rgba(245,243,239,0.2)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.75rem',
    userSelect: 'none',
  };

  return (
    <footer style={{ background: '#1a2240', color: '#F5F3EF' }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, #C4A25B 0%, rgba(196,162,91,0.24) 100%)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '1.25rem 1.5rem 1rem' }}>
        <div className="footer-row">
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ width: 26, height: 26, background: '#C4A25B', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: '0.85rem', color: '#34416D' }}>P</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: '0.8125rem', color: '#F5F3EF', letterSpacing: '0.05em', lineHeight: 1 }}>PARADIGM</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.48rem', color: 'rgba(245,243,239,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 1 }}>Asset Management</div>
            </div>
          </Link>

          {/* Five links per brief: Strategies | Process | Team | Legal | Contact */}
          <nav className="footer-links">
            <Link to="/advisors" style={linkStyle}>Strategies</Link>
            <span style={separatorStyle}>|</span>
            <Link to="/process" style={linkStyle}>Process</Link>
            <span style={separatorStyle}>|</span>
            <Link to="/about" style={linkStyle}>Team</Link>
            <span style={separatorStyle}>|</span>
            <Link to="/legal" style={linkStyle}>Legal</Link>
            <span style={separatorStyle}>|</span>
            <Link to="/contact" style={linkStyle}>Contact</Link>
          </nav>

          {/* Copyright */}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: 'rgba(245,243,239,0.32)', letterSpacing: '0.03em', flexShrink: 0 }}>
            © 2026 Paradigm Asset Management Co. LLC
          </p>
        </div>
      </div>
    </footer>
  );
}
