// pages/api/worksheets/[subject]/[subtopic].ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface Worksheet {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  subject: string;
  subtopic: string;
}

const BASE_URL = process.env.API_BASE_URL || 'https://worksheets.asvabwarriors.org';

const toSlug = (text: string) =>
  text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subject, subtopic } = req.query;

  if (!subject || !subtopic || typeof subject !== 'string' || typeof subtopic !== 'string') {
    return res.status(400).json({ error: 'Missing subject or subtopic' });
  }

  try {
    const response = await fetch(`${BASE_URL}/Worksheets/api/getWorksheets.php`); // or your upstream API for list
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch worksheets' });
    }

    const data = await response.json();

    if (data.status !== 'success' || !Array.isArray(data.data)) {
      return res.status(502).json({ error: 'Invalid upstream API response' });
    }

    // Filter server-side by slug match
    const filtered = data.data.filter((w: Worksheet) =>
      toSlug(w.subject) === toSlug(subject) && toSlug(w.subtopic) === toSlug(subtopic)
    );

    res.status(200).json({ status: 'success', data: filtered });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}