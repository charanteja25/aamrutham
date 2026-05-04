import React, { useState } from 'react';
import { whatsappPhone } from '../data/products';

const TOPICS = [
  { label: '📦 My Order',       wa: 'Hi Aamrutham! I have a question about my order.',         subject: 'Question about my order' },
  { label: '🥭 About Mangoes',  wa: "Hi Aamrutham! I'd like to know more about your mangoes.", subject: 'Question about your mangoes' },
  { label: '💬 Something Else', wa: 'Hi Aamrutham! I need some help.',                          subject: 'General enquiry' },
];

const waUrl   = (msg) => `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`;
const mailUrl = (sub) => `mailto:support@aamrutham.com?subject=${encodeURIComponent(sub)}`;

export default function HelpBot() {
  const [open, setOpen]   = useState(false);
  const [topic, setTopic] = useState(null);

  function close() { setOpen(false); setTopic(null); }
  function toggle() { if (open) close(); else setOpen(true); }

  return (
    <>
      {/* Pill button — sits above basket-float on the right */}
      <button className="helpbot-pill" onClick={toggle} aria-label="Need help?">
        {open ? '✕ Close' : '? Need help'}
      </button>

      {open && (
        <div className="helpbot-widget">
          <div className="helpbot-header">
            <span className="helpbot-avatar">🥭</span>
            <div>
              <div className="helpbot-name">Aamrutham Support</div>
              <div className="helpbot-status">● Online</div>
            </div>
          </div>

          <div className="helpbot-body">
            <div className="helpbot-bubble helpbot-bubble-bot">
              {topic ? topic.reply || 'Reach us on:' : 'Hi! 👋 How can we help you today?'}
            </div>

            {!topic ? (
              <div className="helpbot-options">
                {TOPICS.map(t => (
                  <button key={t.label} className="helpbot-option" onClick={() => setTopic(t)}>
                    {t.label}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="helpbot-bubble helpbot-bubble-user">{topic.label}</div>
                <div className="helpbot-bubble helpbot-bubble-bot">We're here! Reach us on:</div>
                <div className="helpbot-actions">
                  <a href={waUrl(topic.wa)} target="_blank" rel="noopener noreferrer" className="helpbot-btn helpbot-btn-wa">
                    💬 WhatsApp
                  </a>
                  <a href={mailUrl(topic.subject)} className="helpbot-btn helpbot-btn-mail">
                    ✉️ Email
                  </a>
                </div>
                <button className="helpbot-back" onClick={() => setTopic(null)}>← Back</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
