import React from 'react';
import { buildWhatsAppUrl } from '../data/products';

export default function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href={buildWhatsAppUrl('Hi Aamrutham! I have a question about my order 🥭')}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      WA
    </a>
  );
}
