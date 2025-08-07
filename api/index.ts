import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple CORS-enabled health check for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      platform: 'vercel-serverless',
      path: req.url,
      message: 'JobbyAI backend API running on Vercel'
    });
  } else if (req.method === 'POST') {
    // Handle basic auth registration for testing
    const { email, password } = req.body || {};
    
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Email and password required'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Registration successful (demo)',
      user: { email, id: 'demo-' + Date.now() },
      token: 'demo-token-' + Date.now()
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
