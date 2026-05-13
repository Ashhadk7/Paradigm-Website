import { Link } from 'react-router-dom';

export default function Footer() {
  const linkStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8rem',
    color: 'rgba(245,243,239,0.64)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const headingStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.64rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#C4A25B',
    marginBottom: '0.75rem',
  };

  return (
    <footer style={{ background: '#1a2240', color: '#F5F3EF' }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg, #C4A25B 0%, rgba(196,162,91,0.24) 100%)' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 1.25rem' }}>
        <div className="footer-grid">
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.85rem' }}>
              <div style={{ width: 30, height: 30, background: '#C4A25B', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: '1rem', color: '#34416D' }}>P</span>
              </div>
              <div>
                <div style={{ fontFamily: 'Source Serif 4, serif', fontWeight: 700, fontSize: '0.9375rem', color: '#F5F3EF', letterSpacing: '0.05em' }}>PARADIGM</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.55rem', color: 'rgba(245,243,239,0.48)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 1 }}>Asset Management</div>
              </div>
            </Link>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: 'rgba(245,243,239,0.5)', lineHeight: 1.6 }}>
              SEC-registered investment adviser.<br />Founded 1990.
            </p>
          </div>

          <div>
            <p style={headingStyle}>Strategies</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {[
                { label: 'For Advisors', path: '/advisors' },
                { label: 'Family Offices', path: '/familyoffice' },
                { label: 'For Institutions', path: '/institutions' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} style={linkStyle}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={headingStyle}>Firm</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {[
                { label: 'Our Process', path: '/process' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
                { label: 'Legal', path: '/legal' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} style={linkStyle}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p style={headingStyle}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <a href="mailto:jef@paradigmasset.com" style={linkStyle}>jef@paradigmasset.com</a>
              <a href="tel:2127716100" style={linkStyle}>212.771.6100</a>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', color: 'rgba(245,243,239,0.42)', lineHeight: 1.5, marginTop: '0.15rem' }}>
                1345 Avenue of the Americas<br />Suite 107, New York, NY 10105
              </p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.95rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: 'rgba(245,243,239,0.36)', letterSpacing: '0.03em' }}>
            © 2026 Paradigm Asset Management Co. LLC. All Rights Reserved.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', color: 'rgba(245,243,239,0.3)', letterSpacing: '0.02em' }}>
            Not FDIC insured - May lose value - No bank guarantee
          </p>
        </div>
      </div>
    </footer>
  );
}
