import type { NextApiRequest, NextApiResponse } from 'next';

interface WorksheetData {
  id: number;
  title: string;
  description: string;
  subject: string;
  category: string;
  subtopic: string;
  created_at: string;
  thumbnail_url: string;
}

const BASE_URL = process.env.API_BASE_URL || 'https://worksheets.asvabwarriors.org';

// Slugify a string (used for comparing slug to title)
const toSlug = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

// Sanitize input
const sanitize = (input: string) => input.replace(/[^a-zA-Z0-9\- ]/g, '').trim();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { subject, subtopic, worksheet } = req.query;

  if (
    !subject || typeof subject !== 'string' ||
    !subtopic || typeof subtopic !== 'string' ||
    !worksheet || typeof worksheet !== 'string'
  ) {
    return res.status(400).json({ error: 'Missing or invalid parameters.' });
  }

  const sanitizedSubject = sanitize(subject);
  const sanitizedSubtopic = sanitize(subtopic);
  const sanitizedSlug = toSlug(sanitize(worksheet));

  try {
    const response = await fetch(
      `${BASE_URL}/Worksheets/api/getWorksheet.php?title=${encodeURIComponent(sanitizedSlug)}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch worksheet data.' });
    }

    const data = await response.json();

    if (data.status !== 'success' || !Array.isArray(data.data)) {
      return res.status(502).json({ error: 'Invalid data format from upstream API.' });
    }

    const match = data.data.find((w: WorksheetData) =>
      toSlug(w.title) === sanitizedSlug &&
      toSlug(w.subject) === toSlug(sanitizedSubject) &&
      toSlug(w.subtopic) === toSlug(sanitizedSubtopic)
    );

    if (!match) {
      return res.status(404).json({ error: 'Worksheet not found.' });
    }

    return res.status(200).json({ status: 'success', data: match });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
