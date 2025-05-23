// pages/api/worksheet.ts
import type { NextApiRequest, NextApiResponse } from 'next';

const BASE_URL = process.env.API_BASE_URL || 'https://worksheets.asvabwarriors.org';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(`${BASE_URL}/Worksheets/api/getWorksheet.php`);
    if (!response.ok) {
      console.error('Failed to fetch worksheets:', response.status);
      return res.status(502).json({ error: 'Failed to fetch worksheets from upstream' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
