import { Link } from 'react-router-dom';
import { resolveSitePalette } from '../lib/presentationSchema';
import { useContent } from '../lib/useContent';
import { usePresentation } from '../lib/usePresentation';

export default function Footer() {
  const { content: cms } = useContent('site');
  const palette = resolveSitePalette(usePresentation('site'));
  const c = {
    brand_name: cms?.brand_name || 'PARADIGM',
    brand_descriptor: cms?.brand_descriptor || 'Asset Management',
    footer_strategies: cms?.footer_strategies || 'Strategies',
    footer_process: cms?.footer_process || 'Process',
    footer_team: cms?.footer_team || 'Team',
    footer_legal: cms?.footer_legal || 'Legal',
    footer_contact: cms?.footer_contact || 'Contact',
    footer_copyright: cms?.footer_copyright || '\u00A9 2026 Paradigm Asset Management Co. LLC',
  };
  const linkStyle = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '1.0625rem',
    color: 'rgba(245,243,239,0.6)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const separatorStyle = {
    color: 'rgba(245,243,239,0.2)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '1.0625rem',
    userSelect: 'none',
  };

  return (
    <footer style={{ background: palette.tone, color: '#F5F3EF' }}>
      <div style={{ height: 2, background: `linear-gradient(90deg, ${palette.accent} 0%, transparent 100%)` }} />

      <div className="footer-container" style={{ maxWidth: 1600, margin: '0 auto' }}>
        <div className="footer-row">
          {/* Links: Process | Legal | Contact */}
          <nav className="footer-links">
            <Link to="/process" style={linkStyle}>{c.footer_process}</Link>
            <span style={separatorStyle}>|</span>
            <Link to="/legal" style={linkStyle}>{c.footer_legal}</Link>
            <span style={separatorStyle}>|</span>
            <Link to="/contact" style={linkStyle}>{c.footer_contact}</Link>
          </nav>

          {/* Copyright */}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.0625rem', color: 'rgba(245,243,239,0.32)', letterSpacing: '0.03em', flexShrink: 0 }}>
            {c.footer_copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
