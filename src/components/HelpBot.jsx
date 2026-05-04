import React, { useState } from 'react';
import { whatsappPhone } from '../data/products';

const TOPICS = [
  {
    label: '📦 My Order',
    wa: 'Hi Aamrutham! I have a question about my order.',
    emailSubject: 'Question about my order',
    reply: "We'll look into your order right away. Reach us on:",
  },
  {
    label: '🥭 About Mangoes',
    wa: 'Hi Aamrutham! I\'d like to know more about your mangoes.',
    emailSubject: 'Question about your mangoes',
    reply: "Happy to tell you everything about our varieties! Reach us on:",
  },
  {
    label: '💬 Something Else',
    wa: 'Hi Aamrutham! I need some help.',
    emailSubject: 'General enquiry',
    reply: "We're here to help. Reach us on:",
  },
];

const SUPPORT_EMAIL = 'support@aamrutham.com';

export default function HelpBot() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState(null);

  function reset() { setTopic(null); }
  function close() { setOpen(false); setTopic(null); }

  const waUrl = (msg) =>
    `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(msg)}`;
  const mailUrl = (subj) =>
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subj)}`;

  return (
    <>
      {/* Floating button — bottom left */}
      <button
        className="helpbot-float"
        onClick={() => setOpen(o => !o)}
        aria-label="Help"
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="helpbot-widget">
          {/* Header */}
          <div className="helpbot-header">
            <span className="helpbot-avatar">🥭</span>
            <div>
              <div className="helpbot-name">Aamrutham Support</div>
              <div className="helpbot-status">● Online</div>
            </div>
          </div>

          {/* Bot message */}
          <div className="helpbot-body">
            <div className="helpbot-bubble helpbot-bubble-bot">
              {topic ? topic.reply : "Hi! 👋 How can we help you today?"}
            </div>

            {!topic ? (
              <div className="helpbot-options">
                {TOPICS.map(t => (
                  <button
                    key={t.label}
                    className="helpbot-option"
                    onClick={() => setTopic(t)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="helpbot-bubble helpbot-bubble-user">{topic.label}</div>
                <div className="helpbot-actions">
                  <a
                    href={waUrl(topic.wa)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="helpbot-btn helpbot-btn-wa"
                  >
                    <span>💬</span> WhatsApp
                  </a>
                  <a
                    href={mailUrl(topic.emailSubject)}
                    className="helpbot-btn helpbot-btn-mail"
                  >
                    <span>✉️</span> Email
                  </a>
                </div>
                <button className="helpbot-back" onClick={reset}>← Back</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
