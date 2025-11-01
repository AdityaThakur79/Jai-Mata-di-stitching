import fetch from 'node-fetch';

const normalizeIndianPhone = (val) => {
  if (!val) return undefined;
  const digits = String(val).replace(/\D/g, '');
  const last10 = digits.slice(-10);
  return last10 ? `91${last10}` : undefined;
};

export const sendInvoiceWhatsapp = async ({ phone, pdfUrl, orderNumber, totalAmount }) => {
  if (!process.env.WHATSAPP_ENABLED || process.env.WHATSAPP_ENABLED.toLowerCase() !== 'true') {
    return { skipped: true, reason: 'WhatsApp disabled in env' };
  }
  
  if (!process.env.AISENSY_API_KEY) {
    return { skipped: true };
  }
  
  const destination = normalizeIndianPhone(phone);
  if (!destination) {
    return { skipped: true, reason: 'Invalid phone number' };
  }
  
  const payload = {
    apiKey: process.env.AISENSY_API_KEY,
    destination: destination,
    campaignName: process.env.AISENSY_CAMPAIGN || 'Invoice_Notification',
    userName: 'JMD Stitching',
    templateParams: [orderNumber, `₹${Number(totalAmount).toLocaleString('en-IN')}`],
    source: 'invoice-notification'
  };
  
  if (pdfUrl && pdfUrl.trim() !== '') {
    payload.media = {
      url: pdfUrl,
      filename: `Invoice-${orderNumber}.pdf`
    };
  }
  
  const endpoints = [
    process.env.AISENSY_ENDPOINT,
    'https://backend.aisensy.com/campaign/t1/api/v2',
    'https://api.aisensy.com/campaign/v1/api/send-template',
    'https://backend.aisensy.com/campaign/v1/api/send-template'
  ].filter(Boolean);
  
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        let result;
        try {
          result = JSON.parse(await res.text());
        } catch (e) {
          result = { success: true };
        }
        return result;
      } else {
        lastError = new Error(`Failed: ${res.status}`);
      }
    } catch (error) {
      lastError = error;
    }
  }
  
  return { skipped: true, reason: 'Endpoints failed', error: lastError?.message };
};

export const sendOrderConfirmationWhatsapp = async ({ phone, clientName, billNumber, orderType, totalAmount, paymentStatus, pdfUrl }) => {
  if (!process.env.WHATSAPP_ENABLED || process.env.WHATSAPP_ENABLED.toLowerCase() !== 'true') {
    return { skipped: true, reason: 'WhatsApp disabled in env' };
  }
  
  if (!process.env.AISENSY_API_KEY) {
    return { skipped: true };
  }
  
  const destination = normalizeIndianPhone(phone);
  if (!destination) {
    return { skipped: true, reason: 'Invalid phone number' };
  }
  
  const payload = {
    apiKey: process.env.AISENSY_API_KEY,
    campaignName: 'order_invoice',
    destination: destination,
    userName: clientName,
    templateParams: [
      clientName,
      billNumber,
      orderType,
      `${Number(totalAmount).toLocaleString('en-IN')}`,
      paymentStatus
    ],
    source: 'order-confirmation'
  };
  
  if (pdfUrl && pdfUrl.trim() !== '') {
    payload.media = {
      url: pdfUrl,
      filename: `Invoice-${billNumber}.pdf`
    };
  }
  
  const endpoints = [
    process.env.AISENSY_ENDPOINT,
    'https://backend.aisensy.com/campaign/t1/api/v2',
    'https://api.aisensy.com/campaign/v1/api/send-template',
    'https://backend.aisensy.com/campaign/v1/api/send-template'
  ].filter(Boolean);
  
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        let result;
        try {
          result = JSON.parse(await res.text());
        } catch (e) {
          result = { success: true };
        }
        return result;
      } else {
        lastError = new Error(`Failed: ${res.status}`);
      }
    } catch (error) {
      lastError = error;
    }
  }
  
  return { skipped: true, reason: 'Endpoints failed', error: lastError?.message };
};
