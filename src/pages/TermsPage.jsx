import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';

const SECTIONS = [
  {
    title: 'About Aamrutham',
    body: `Aamrutham is a farm-to-home mango brand based in Bobbili, Andhra Pradesh. We grow and deliver naturally farmed, tree-ripened heritage mango varieties to customers in Hyderabad, Telangana. By using our website or placing an order, you agree to these Terms of Service.`,
  },
  {
    title: 'Ordering',
    body: `Orders are placed through our website at www.aamrutham.com and confirmed via WhatsApp. An order is considered confirmed only after successful payment via Razorpay and a confirmation message from our team.

We reserve the right to cancel any order in the event of stock unavailability, delivery constraints, or payment disputes. In such cases, a full refund will be processed to the original payment method within 5–7 business days.`,
  },
  {
    title: 'Delivery',
    body: `We currently deliver only within Hyderabad, Telangana. Deliveries are made to pincodes listed on our website. We do not guarantee specific delivery times but aim to deliver within the window communicated on WhatsApp.

Delivery dates may be affected by weather, farm conditions, or harvest readiness. We will communicate any delays promptly.`,
  },
  {
    title: 'Product Quality',
    body: `All mangoes are naturally farmed, tree-ripened, and hand-graded before dispatch. Mangoes are a perishable, seasonal agricultural product. Natural variations in size, colour, and sweetness between individual fruits are expected and do not constitute a defect.

Deliveries begin from May 10th each season, subject to harvest readiness. We do not use artificial ripening agents or carbide.`,
  },
  {
    title: 'Pricing',
    body: `All prices displayed on the website are inclusive of delivery within Hyderabad for orders above ₹499. A delivery fee applies to smaller orders. Prices are subject to change without notice but orders already confirmed at a given price will be honoured at that price.`,
  },
  {
    title: 'Payments',
    body: `Payments are processed securely via Razorpay. We accept UPI, credit/debit cards, and net banking. Aamrutham does not store any payment credentials. In the event of a payment failure, no amount will be deducted — please retry or contact us on WhatsApp.`,
  },
  {
    title: 'Cancellations',
    body: `Orders may be cancelled before they are dispatched from our farm. Once a delivery is in transit, cancellations are not possible. To cancel an order, please contact us on WhatsApp at +91 76708 26759 as early as possible.`,
  },
  {
    title: 'Bulk Orders',
    body: `Bulk enquiries are handled separately via WhatsApp. Pricing, availability, and delivery timelines for bulk orders are agreed upon individually. Bulk orders require advance notice and may be subject to seasonal availability.`,
  },
  {
    title: 'Intellectual Property',
    body: `All content on this website — including the Aamrutham name, logo, photographs, copy, and product descriptions — is the property of Aamrutham. Reproduction or commercial use without written permission is prohibited.`,
  },
  {
    title: 'Limitation of Liability',
    body: `Aamrutham's liability is limited to the value of your order. We are not responsible for indirect, incidental, or consequential damages arising from the use of our products or website. Our mangoes are a perishable food product — once delivered and accepted, we are not liable for storage or handling by the customer.`,
  },
  {
    title: 'Governing Law',
    body: `These Terms of Service are governed by the laws of India. Any disputes arising from the use of our services shall be subject to the jurisdiction of courts in Hyderabad, Telangana.`,
  },
  {
    title: 'Contact',
    body: `For any questions about these Terms, please contact us:\n\nWhatsApp: +91 76708 26759\nWebsite: www.aamrutham.com\nFarm: Bobbili, Andhra Pradesh`,
  },
];

export default function TermsPage() {
  usePageMeta({
    title: 'Terms of Service — Aamrutham',
    description: 'Terms and conditions for ordering mangoes from Aamrutham — delivery, pricing, cancellations, and more.',
  });

  return (
    <main className="section section-cream" style={{ minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '720px' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--leaf)', textDecoration: 'none' }}>← Back to Home</Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 400, marginTop: '1rem', marginBottom: '0.5rem', color: '#1a3008' }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#888', margin: 0 }}>
            Last updated: May 2026 · Aamrutham, Bobbili Farms
          </p>
          <p style={{ marginTop: '1rem', color: '#555', lineHeight: 1.7, fontSize: '0.92rem' }}>
            Please read these terms carefully before placing an order or using our website.
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
            These terms were last updated in May 2026. We may update them periodically. Continued use of our website after changes constitutes your acceptance of the revised terms.
          </p>
        </div>

        <div style={{ marginTop: '2rem', paddingBottom: '3rem' }}>
          <Link to="/privacy" style={{ fontSize: '0.82rem', color: 'var(--leaf)' }}>Read our Privacy Policy →</Link>
        </div>

      </div>
    </main>
  );
}
