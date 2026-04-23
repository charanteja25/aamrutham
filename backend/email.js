import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation({ to, name, aamOrderId, cartItems, amount }) {
  const itemRows = cartItems.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0e8dc;">${i.name || i.productId}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0e8dc;">${i.packLabel}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0e8dc;text-align:right;">₹${((i.price || 0) * (i.qty || 1)).toLocaleString('en-IN')}</td>
    </tr>`
  ).join('');

  await resend.emails.send({
    from: 'Aamrutham <support@aamrutham.com>',
    to,
    subject: `Order Confirmed – ${aamOrderId}`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fffdf8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,0.07);">
    <div style="background:#2d5016;padding:32px 40px;text-align:center;">
      <div style="font-size:36px;">🥭</div>
      <h1 style="color:#fff;margin:12px 0 4px;font-size:22px;font-weight:700;">Order Confirmed!</h1>
      <p style="color:#b8d4a0;margin:0;font-size:14px;">Thank you for ordering from Aamrutham</p>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#444;font-size:15px;">Hi ${name},</p>
      <p style="color:#444;font-size:15px;">Your order has been confirmed. We will handpick your mangoes and deliver them fresh.</p>
      <div style="background:#f9f5ef;border-radius:10px;padding:16px 20px;margin:24px 0;">
        <p style="margin:0;font-size:13px;color:#888;text-transform:uppercase;letter-spacing:0.05em;">Order ID</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#2d5016;letter-spacing:0.04em;">${aamOrderId}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <thead>
          <tr style="background:#f9f5ef;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Item</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Pack</th>
            <th style="padding:8px 12px;text-align:right;font-size:12px;color:#888;font-weight:600;text-transform:uppercase;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:12px;font-weight:700;color:#1a1a1a;">Total</td>
            <td style="padding:12px;text-align:right;font-weight:700;color:#2d5016;font-size:16px;">₹${(amount/100).toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>
      <p style="color:#666;font-size:14px;line-height:1.6;">Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/917670826759" style="color:#2d5016;">+91 76708 26759</a>.</p>
      <p style="color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #f0e8dc;padding-top:16px;">Aamrutham · Pure Farm Mangoes · Bobbili, Andhra Pradesh</p>
    </div>
  </div>
</body>
</html>`,
  });
}
