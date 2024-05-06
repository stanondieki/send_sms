import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
 if (req.method === 'POST') {
    // Handle the POST request
    let { to, message } = req.body;

    // Ensure 'to' is a string
    if (Array.isArray(to)) {
      // If 'to' is an array, convert it to a string
      to = to.join(','); // Join array elements with a comma
    }

    // Now 'to' is guaranteed to be a string
    console.log(`Sending message to: ${to}`);
    console.log(`Message: ${message}`);

    // Here, you would typically integrate with an SMS gateway API to send the message
    // For demonstration purposes, we'll simulate sending the message
    res.status(200).json({ message: 'Messages sent successfully' });
 } else {
    // Respond with a 405 Method Not Allowed if the method is not POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
 }
}
