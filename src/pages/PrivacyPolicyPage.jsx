import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: `When you place an order or make an enquiry through Aamrutham, we collect the following information:

• Full name
• Mobile number (WhatsApp)
• Email address (optional, where provided)
• Delivery address within Hyderabad
• Order details (varieties, quantities, pack sizes)

We do not collect payment card details. All payment information is handled directly by Razorpay and is subject to their privacy policy.`,
  },
  {
    title: 'How We Use Your Information',
    body: `We use the information you provide solely to:

• Process and fulfil your mango order
• Coordinate delivery to your address in Hyderabad
• Communicate with you about your order on WhatsApp
• Respond to enquiries you initiate (bulk orders, feedback)
• Improve our service based on order history

We do not sell, rent, or share your personal information with any third party for marketing purposes.`,
  },
  {
    title: 'WhatsApp Communication',
    body: `By placing an order or submitting an enquiry, you consent to being contacted on WhatsApp by our team at +91 76708 26759. We use WhatsApp to:

• Confirm your order and delivery details
• Send updates about your delivery
• Follow up on bulk enquiries

We will not add you to any broadcast lists or send unsolicited promotional messages.`,
  },
  {
    title: 'Payment Processing',
    body: `All payments are processed securely through Razorpay. Aamrutham does not store your card details, UPI credentials, or banking information. Razorpay's privacy policy governs how your payment data is handled. We receive only the confirmation of a successful or failed payment.`,
  },
  {
    title: 'Delivery Information',
    body: `We currently deliver only within Hyderabad. Your delivery address is used only to fulfil your order and is not shared with any third party beyond our delivery team.`,
  },
  {
    title: 'Data Retention',
    body: `We retain your order information for a period necessary to handle any queries related to your order, and as required under applicable Indian law. You may request deletion of your personal data by contacting us on WhatsApp at +91 76708 26759.`,
  },
  {
    title: 'Cookies and Tracking',
    body: `Our website uses only essential browser storage (localStorage) to remember your cart and saved address for a smoother checkout experience. We do not use third-party advertising cookies or tracking pixels.`,
  },
  {
    title: 'Children\'s Privacy',
    body: `Our services are not directed at children under the age of 13. We do not knowingly collect personal information from children.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. Continued use of our website after changes constitutes acceptance of the revised policy.`,
  },
  {
    title: 'Contact Us',
    body: `If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out to us:\n\nWhatsApp: +91 76708 26759\nFarm: Bobbili, Andhra Pradesh\nDeliveries: Hyderabad, Telangana`,
  },
];

export default function PrivacyPolicyPage() {
  usePageMeta({
    title: 'Privacy Policy — Aamrutham',
    description: 'How Aamrutham collects, uses, and protects your personal information when you order mangoes or make an enquiry.',
  });

  return (
    <main className="section section-cream" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '720px' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--leaf)', textDecoration: 'none' }}>← Back to Home</Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400, marginTop: '1rem', marginBottom: '0.5rem', color: '#1a3008' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>
            Last updated: May 2026 · Aamrutham, Bobbili Farms
          </p>
          <p style={{ marginTop: '1rem', color: '#555', lineHeight: 1.7, fontSize: '0.92rem' }}>
            At Aamrutham, we respect your privacy. This policy explains what information we collect when you order mangoes or contact us, and how we use it.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {SECTIONS.map((s, i) => (
            <div key={s.title} style={{ borderTop: '1px solid #e8eed8', paddingTop: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1a3008', marginBottom: '0.75rem' }}>
                {i + 1}. {s.title}
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.8, whiteSpace: 'pre-line', margin: 0 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem', padding: '1.25rem', background: '#f4fbe8', borderRadius: '12px', border: '1px solid #c9e9a0' }}>
          <p style={{ fontSize: '0.82rem', color: '#3a6b10', margin: 0, lineHeight: 1.6 }}>
            This policy is governed by the laws of India, including the Digital Personal Data Protection Act, 2023 (DPDP Act). By using our website or placing an order, you agree to this Privacy Policy.
          </p>
        </div>

        <div style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
          <Link to="/terms" style={{ fontSize: '0.82rem', color: 'var(--leaf)' }}>Read our Terms of Service →</Link>
        </div>

      </div>
    </main>
  );
}
