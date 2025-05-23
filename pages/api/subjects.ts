import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      console.error('API_BASE_URL is not defined in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    const response = await fetch(`${baseUrl}/Subjects/api/get_subjects.php`);
    if (!response.ok) {
      console.error('Failed to fetch subjects, status:', response.status);
      throw new Error('Failed to fetch subjects');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
