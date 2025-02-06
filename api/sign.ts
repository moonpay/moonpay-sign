import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  // Validate URL parameter
  if (!url || Array.isArray(url)) {
    return res
      .status(400)
      .json({ error: 'URL parameter is required and must be a string' });
  }

  // Get secret key from environment variable
  const secretKey = process.env.SIGNING_SECRET;
  if (!secretKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(url);
    const signature = hmac.digest('hex');

    // Return the signature
    return res.status(200).json({
      signature,
      signedUrl: `${url}?signature=${signature}`,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate signature' });
  }
}
