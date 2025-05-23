// pages/api/worksheets/[subject].ts
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
  const { subject } = req.query;

  if (!subject || typeof subject !== 'string') {
    return res.status(400).json({ error: 'Subject parameter is required' });
  }

  try {
    const response = await fetch(`${BASE_URL}/Worksheets/api/getWorksheet.php`);
    if (!response.ok) {
      console.error('Failed to fetch worksheets:', response.status);
      return res.status(502).json({ error: 'Failed to fetch worksheets from upstream' });
    }

    const data = await response.json();

    if (data.status !== 'success' || !Array.isArray(data.data)) {
      return res.status(502).json({ error: 'Upstream API returned invalid data' });
    }

    // Filter worksheets by subject slug
    const filteredWorksheets = data.data.filter((worksheet: Worksheet) =>
      toSlug(worksheet.subject) === toSlug(subject)
    );

    return res.status(200).json({ status: 'success', data: filteredWorksheets });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
