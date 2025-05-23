import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { subject_id } = req.query;

  if (!subject_id || typeof subject_id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid subject_id' });
  }

  try {
    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      console.error('API_BASE_URL is not defined in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    const response = await fetch(
      `${baseUrl}/Subjects/Subtopics/api/get_subtopics.php?subject_id=${encodeURIComponent(subject_id)}`
    );

    if (!response.ok) {
      console.error('Failed to fetch subtopics, status:', response.status);
      throw new Error('Failed to fetch subtopics');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
