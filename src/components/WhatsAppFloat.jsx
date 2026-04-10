import React from 'react';
import { buildWhatsAppUrl } from '../data/products';

export default function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href={buildWhatsAppUrl('Hi Aamrutham! I want to pre-order mangoes 🥭')}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      WA
    </a>
  );
}
