import fetch from 'node-fetch';

export const sendInvoiceWhatsapp = async ({ phone, pdfUrl, orderNumber, totalAmount }) => {
  if (!process.env.AISENSY_API_KEY || !process.env.AISENSY_ENDPOINT) {
    console.warn('AiSensy credentials missing; skipping WhatsApp send');
    return { skipped: true };
  }
  const payload = {
    apiKey: process.env.AISENSY_API_KEY,
    destination: phone, // expects 91xxxxxxxxxx
    campaignName: process.env.AISENSY_CAMPAIGN || 'Invoice_Notification',
    userName: 'JMD Stitching',
    templateParams: [orderNumber, `₹${Number(totalAmount).toLocaleString('en-IN')}`, pdfUrl],
    media: {
      url: pdfUrl,
      filename: `Invoice-${orderNumber}.pdf`,
      mimeType: 'application/pdf'
    }
  };
  const res = await fetch(process.env.AISENSY_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AiSensy send failed: ${res.status} ${text}`);
  }
  return res.json();
};


