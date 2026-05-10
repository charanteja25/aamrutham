/**
 * MSG91 WhatsApp helper.
 * Env vars required:
 *   MSG91_AUTH_KEY          — API auth key from MSG91 dashboard
 *   MSG91_WHATSAPP_NUMBER   — sender number e.g. 917700000000
 *   MSG91_ORDER_TEMPLATE    — approved template name for order confirmation
 *   MSG91_BLAST_TEMPLATE    — approved template name for stall blast
 */

const API_BASE = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";

async function sendTemplate({ to, templateName, params = [] }) {
  const url = `${API_BASE}?authkey=${process.env.MSG91_AUTH_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      integrated_number: process.env.MSG91_WHATSAPP_NUMBER,
      content_type: "template",
      payload: {
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en" },
          components: params.length
            ? [{ type: "body", parameters: params.map(text => ({ type: "text", text: String(text) })) }]
            : [],
        },
      },
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`MSG91 error: ${JSON.stringify(data)}`);
  return data;
}

export async function sendOrderConfirmWhatsApp({ phone, firstName, orderId, items, amount }) {
  const templateName = process.env.MSG91_ORDER_TEMPLATE || "aamrutham_order_confirm";
  return sendTemplate({
    to: `91${phone}`,
    templateName,
    params: [firstName, orderId, items, amount],
  });
}

export async function sendBlastWhatsApp({ phone, firstName }) {
  const templateName = process.env.MSG91_BLAST_TEMPLATE || "aamrutham_blast";
  return sendTemplate({
    to: `91${phone}`,
    templateName,
    params: [firstName],
  });
}
