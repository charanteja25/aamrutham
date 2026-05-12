/**
 * MSG91 WhatsApp helper.
 * Env vars required:
 *   MSG91_AUTH_KEY          — API auth key from MSG91 dashboard
 *   MSG91_WHATSAPP_NUMBER   — sender number e.g. 919966558132
 *   MSG91_NAMESPACE         — WhatsApp business namespace from MSG91 template page
 *   MSG91_ORDER_TEMPLATE    — approved template name for order confirmation
 *   MSG91_BLAST_TEMPLATE    — approved template name for stall blast
 */

const API_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";

async function sendTemplate({ to, templateName, params = [], langCode = "en" }) {
  const components = {};
  params.forEach((value, i) => {
    components[`body_${i + 1}`] = { type: "text", value: String(value) };
  });

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      authkey: process.env.MSG91_AUTH_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      integrated_number: process.env.MSG91_WHATSAPP_NUMBER,
      content_type: "template",
      payload: {
        messaging_product: "whatsapp",
        type: "template",
        template: {
          name: templateName,
          language: { code: langCode, policy: "deterministic" },
          namespace: process.env.MSG91_NAMESPACE,
          to_and_components: [{
            to: [to],
            components,
          }],
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
    params: [String(firstName), String(orderId)],
  });
}

export async function sendBlastWhatsApp({ phone, firstName, stallName }) {
  const templateName = process.env.MSG91_BLAST_TEMPLATE || "aamrutham_blast_";
  return sendTemplate({
    to: `91${phone}`,
    templateName,
    params: [firstName, stallName],
    langCode: "en_GB",
  });
}
