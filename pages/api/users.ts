import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      // Execute the query to fetch phone numbers only
      const [rows] = await connection.execute('SELECT phoneNumber FROM recipients');
      await connection.end();

      // Type assertion to treat rows as phone numbers
      const phoneNumbers = (rows as { phoneNumber: string; }[]).map(row => row.phoneNumber);

      // Send response with phone numbers only
      res.status(200).json(phoneNumbers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch phone numbers' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
