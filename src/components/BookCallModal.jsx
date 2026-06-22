import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitBookCallLead, isKlaviyoConfigured } from '../lib/klaviyo';

const BookCallContext = createContext({ open: () => {} });

export function useBookCall() {
  return useContext(BookCallContext);
}

const EMPTY = { firstName: '', lastName: '', email: '', phone: '', company: '', message: '' };

export function BookCallProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <BookCallContext.Provider value={{ open }}>
      {children}
      <BookCallModal isOpen={isOpen} onClose={close} />
    </BookCallContext.Provider>
  );
}

function BookCallModal({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const reset = () => {
    setForm(EMPTY);
    setStatus('idle');
    setErrorMsg('');
  };

  const handleClose = () => {
    onClose();
    // brief delay so the success/error state doesn't flash during the exit anim
    setTimeout(reset, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      await submitBookCallLead(form);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="bookcall-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="bookcall-modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Book a 20-minute call"
          >
            <button className="bookcall-close" onClick={handleClose} aria-label="Close">×</button>

            {status === 'success' ? (
              <div className="bookcall-success">
                <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>Thank you</p>
                <h3 className="bookcall-title">We&rsquo;ll be in touch shortly.</h3>
                <p className="bookcall-sub">
                  Your details are in. A member of the Paradigm team will reach out to schedule your
                  20-minute call.
                </p>
                <button className="btn-gold" onClick={handleClose} style={{ marginTop: '1.5rem' }}>
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Book a 20-Minute Call</p>
                <h3 className="bookcall-title">Tell us where to reach you.</h3>
                <p className="bookcall-sub">
                  Share a few details and we&rsquo;ll set up a 20-minute call to walk through what
                  collective intelligence looks like for you.
                </p>

                <form className="bookcall-form" onSubmit={handleSubmit}>
                  <div className="bookcall-row">
                    <label className="bookcall-field">
                      <span>First name</span>
                      <input type="text" value={form.firstName} onChange={update('firstName')} autoComplete="given-name" />
                    </label>
                    <label className="bookcall-field">
                      <span>Last name</span>
                      <input type="text" value={form.lastName} onChange={update('lastName')} autoComplete="family-name" />
                    </label>
                  </div>

                  <label className="bookcall-field">
                    <span>Email *</span>
                    <input type="email" required value={form.email} onChange={update('email')} autoComplete="email" />
                  </label>

                  <div className="bookcall-row">
                    <label className="bookcall-field">
                      <span>Phone</span>
                      <input type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" />
                    </label>
                    <label className="bookcall-field">
                      <span>Company / Firm</span>
                      <input type="text" value={form.company} onChange={update('company')} autoComplete="organization" />
                    </label>
                  </div>

                  <label className="bookcall-field">
                    <span>What would you like to discuss?</span>
                    <textarea rows={3} value={form.message} onChange={update('message')} />
                  </label>

                  {status === 'error' && (
                    <p className="bookcall-error">{errorMsg}</p>
                  )}

                  <button type="submit" className="btn-gold bookcall-submit" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Submitting…' : 'Request My Call'}
                  </button>

                  {!isKlaviyoConfigured() && (
                    <p className="bookcall-config-note">
                      Note: Klaviyo keys are not configured yet — set VITE_KLAVIYO_PUBLIC_KEY and
                      VITE_KLAVIYO_LIST_ID to enable submissions.
                    </p>
                  )}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
