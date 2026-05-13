import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function Legal() {
  return (
    <>
      <Helmet>
        <title>Legal & Disclosures — Paradigm Asset Management</title>
        <meta name="description" content="Legal disclosures, regulatory information, and privacy policy for Paradigm Asset Management Co. LLC." />
      </Helmet>

      <section style={{
        background: '#F5F3EF',
        paddingTop: '9rem',
        paddingBottom: '4rem',
        borderBottom: '1px solid rgba(52,65,109,0.08)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow" style={{ marginBottom: '1rem', color: '#34416D' }}>Disclosures</p>
            <h1 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: '#34416D', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Legal & Regulatory Information
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: '1rem', color: '#637890', maxWidth: 560, lineHeight: 1.7 }}>
              Paradigm Asset Management Co. LLC is a registered investment adviser. The following disclosures apply to all content on this website.
            </p>
          </motion.div>
        </div>
      </section>

      <section style={{ background: '#fff', padding: '5rem 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>

          {/* General Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '1rem' }}>
              General Disclaimer
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: '#637890' }}>
              <p>
                The information contained on this website is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any security. Nothing on this website should be construed as investment advice or a recommendation to buy, sell, or hold any particular security or investment.
              </p>
              <p>
                Past performance does not guarantee future results. All investments involve risk, including the possible loss of principal. The value of investments and the income from them may fluctuate and are not guaranteed.
              </p>
              <p>
                This website contains forward-looking statements that are based on current expectations and assumptions. These statements involve known and unknown risks and uncertainties that may cause actual results to differ materially from those expressed or implied.
              </p>
            </div>
          </motion.div>

          {/* Registration */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '1rem' }}>
              Registration
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: '#637890' }}>
              <p>
                Paradigm Asset Management Co. LLC is registered as an investment adviser with the U.S. Securities and Exchange Commission (SEC). Registration does not imply a certain level of skill or training.
              </p>
              <p>
                A copy of Paradigm Asset Management's Form ADV Part 2A (Firm Brochure) is available upon request. Please contact us at <a href="mailto:jef@paradigmasset.com" style={{ color: '#34416D', textDecoration: 'none' }}>jef@paradigmasset.com</a> or call <a href="tel:2127716100" style={{ color: '#34416D', textDecoration: 'none' }}>212.771.6100</a> to request a copy.
              </p>
            </div>
          </motion.div>

          {/* No Performance Data */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '1rem' }}>
              Performance Information
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: '#637890' }}>
              This website does not contain performance data or return figures for Paradigm Asset Management's investment strategies. Any reference to client names or relationships is provided for context regarding the firm's history and does not constitute an endorsement or testimonial. Paradigm Asset Management does not guarantee that similar results will be achieved by future clients.
            </p>
          </motion.div>

          {/* Privacy Policy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '1rem' }}>
              Privacy Policy
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: '#637890' }}>
              <p>
                Paradigm Asset Management Co. LLC is committed to protecting the privacy of individuals who visit this website and those who do business with us. We collect only the personal information you voluntarily provide through contact forms or direct correspondence.
              </p>
              <p>
                We do not sell, trade, or otherwise transfer personal information to outside parties. Information provided through this website is used solely to respond to inquiries and to provide the services requested.
              </p>
              <p>
                We may collect non-personally identifiable information such as browser type, referring pages, and pages visited for the purpose of improving the website experience. This information is not linked to any personally identifiable information.
              </p>
              <p>
                By using this website, you consent to our privacy practices as described here. We reserve the right to update this policy. Any changes will be posted on this page.
              </p>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#F5F3EF',
              borderLeft: '4px solid #C4A25B',
              padding: '2rem 2.5rem',
              borderRadius: 2,
            }}
          >
            <h2 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.25rem', color: '#34416D', marginBottom: '0.875rem' }}>
              Contact & Registered Address
            </h2>
            <div style={{ fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: '#637890' }}>
              <p style={{ marginBottom: '0.25rem' }}>Paradigm Asset Management Co. LLC</p>
              <p style={{ marginBottom: '0.25rem' }}>1345 Avenue of the Americas, Suite 107</p>
              <p style={{ marginBottom: '1rem' }}>New York, NY 10105</p>
              <p>
                <a href="mailto:jef@paradigmasset.com" style={{ color: '#34416D', textDecoration: 'none' }}>jef@paradigmasset.com</a>
                {' · '}
                <a href="tel:2127716100" style={{ color: '#34416D', textDecoration: 'none' }}>212.771.6100</a>
              </p>
            </div>
          </motion.div>

          <p style={{ fontFamily: 'Inter', fontSize: '0.8125rem', color: '#637890', borderTop: '1px solid rgba(52,65,109,0.1)', paddingTop: '2rem' }}>
            © 2026 Paradigm Asset Management Co. LLC. All rights reserved.
          </p>

        </div>
      </section>
    </>
  );
}
