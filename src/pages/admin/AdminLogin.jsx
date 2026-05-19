import { useState } from 'react';
import { supabase } from '../../lib/supabase';

const ADMIN_EMAIL = 'admin@paradigmasset.com';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password,
    });

    if (authError) {
      setError('Invalid password');
      setLoading(false);
    } else {
      onLogin();
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>P</div>
          <div>
            <div style={styles.logoTitle}>PARADIGM</div>
            <div style={styles.logoSub}>ASSET MANAGEMENT</div>
          </div>
        </div>
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <p style={styles.subtext}>Enter your password to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            autoFocus
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F3EF',
    padding: '1rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '3rem 2.5rem',
    maxWidth: 400,
    width: '100%',
    boxShadow: '0 1px 3px rgba(52,65,109,0.08)',
    border: '1px solid rgba(52,65,109,0.08)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '2rem',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#34416D',
    color: '#C4A25B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontWeight: 700,
    fontSize: '1rem',
  },
  logoTitle: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 800,
    fontSize: '0.8rem',
    letterSpacing: '0.12em',
    color: '#34416D',
  },
  logoSub: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.5rem',
    letterSpacing: '0.14em',
    color: '#637890',
    fontWeight: 600,
  },
  heading: {
    fontFamily: 'Source Serif 4, Georgia, serif',
    fontSize: '1.5rem',
    color: '#34416D',
    marginBottom: '0.5rem',
  },
  subtext: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.875rem',
    color: '#637890',
    marginBottom: '1.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    fontFamily: 'Inter, sans-serif',
    border: '1px solid rgba(52,65,109,0.2)',
    borderRadius: '6px',
    outline: 'none',
    marginBottom: '0.75rem',
    boxSizing: 'border-box',
  },
  error: {
    color: '#c0392b',
    fontSize: '0.8125rem',
    fontFamily: 'Inter, sans-serif',
    marginBottom: '0.75rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    background: '#34416D',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.9375rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.02em',
  },
};
