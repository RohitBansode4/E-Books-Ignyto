import type { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = process.env.API_BASE_URL || 'https://worksheets.asvabwarriors.org';

// Simple sanitizers to allow safe characters only
const sanitize = (input: string) => input.trim().replace(/[^\w\s@.+-]/g, '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, mobile, worksheet_id, subject, subtopic } = req.body;

  // Basic validation & sanitization
  if (
    !name || typeof name !== 'string' || !name.trim() ||
    !email || typeof email !== 'string' || !email.trim() ||
    !mobile || typeof mobile !== 'string' || !mobile.trim() ||
    !worksheet_id || typeof worksheet_id !== 'number' ||
    !subject || typeof subject !== 'string' ||
    !subtopic || typeof subtopic !== 'string'
  ) {
    return res.status(400).json({ error: 'Invalid or missing input fields.' });
  }

  const sanitizedData = {
    name: sanitize(name),
    email: sanitize(email),
    mobile: sanitize(mobile),
    worksheet_id,
    subject: sanitize(subject),
    subtopic: sanitize(subtopic),
  };

  try {
    // Proxy POST request to upstream API
    const response = await fetch(`${BASE_URL}/Worksheets/api/send-email.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedData),
    });

    if (!response.ok) {
      console.error('Failed to send email:', response.status, response.statusText);
      return res.status(502).json({ error: 'Failed to send email.' });
    }

    const result = await response.json();

    if (result.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ error: result.error || 'Email sending failed.' });
    }
  } catch (error) {
    console.error('Error in send-email API:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}