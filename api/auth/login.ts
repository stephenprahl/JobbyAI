// Simple auth login endpoint for Vercel
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = (req.body as any) || {};

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password required'
      });
      return;
    }

    // Demo login - replace with real logic later
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 'demo-user-123',
          email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'user'
        },
        token: 'demo-jwt-' + Date.now(),
        refreshToken: 'demo-refresh-' + Date.now()
      }
    });
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
