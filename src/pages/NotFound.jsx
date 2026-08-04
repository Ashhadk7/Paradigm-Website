import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Paradigm Asset Management</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section
        style={{
          background: '#F5F3EF',
          padding: 'clamp(6rem, 14vw, 10rem) 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C4A25B',
              marginBottom: '1rem',
            }}
          >
            Error 404
          </p>
          <h1
            style={{
              fontFamily: '"Source Serif 4", serif',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#34416D',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
            }}
          >
            This page could not be found.
          </h1>
          <p
            style={{
              fontFamily: 'Inter',
              fontSize: '1rem',
              color: '#637890',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            The page you are looking for may have moved or no longer exists.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              fontFamily: 'Inter',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#2C2C2C',
              background: '#C4A25B',
              padding: '0.85rem 1.75rem',
              borderRadius: '2px',
              textDecoration: 'none',
            }}
          >
            Return Home
          </Link>
        </div>
      </section>
    </>
  );
}
