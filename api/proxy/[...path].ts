import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const backend = process.env.BACKEND_URL
  if (!backend) {
    res.status(500).json({ success: false, error: 'BACKEND_URL not configured on Vercel' })
    return
  }

  // build target url
  const pathParts = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path || '')
  const query = req.url && req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''
  const target = `${backend.replace(/\/\/$/, '')}/${pathParts}${query}`

  try {
    const forwardHeaders: Record<string, string> = {}
    // copy headers but avoid host
    Object.entries(req.headers || {}).forEach(([k, v]) => {
      if (!v) return
      if (k.toLowerCase() === 'host') return
      // headers can be string | string[]
      forwardHeaders[k] = Array.isArray(v) ? v.join(',') : String(v)
    })

    // Build body for non-GET/HEAD
    let body: any = undefined
    if (req.method && !['GET', 'HEAD'].includes(req.method.toUpperCase())) {
      // If body was parsed by Vercel, it will be in req.body
      if (req.body && Object.keys(req.body).length > 0) {
        body = JSON.stringify(req.body)
        forwardHeaders['content-type'] = forwardHeaders['content-type'] || 'application/json'
      }
    }

    const response = await fetch(target, {
      method: req.method,
      headers: forwardHeaders as any,
      body,
      // allow redirects
      redirect: 'follow'
    })

    // forward status and headers
    const text = await response.text()
    res.status(response.status)
    response.headers.forEach((value, key) => {
      // avoid overwriting certain headers in the serverless response
      if (key.toLowerCase() === 'transfer-encoding') return
      if (key.toLowerCase() === 'content-encoding') return
      res.setHeader(key, value)
    })

    // send body
    res.send(text)
  } catch (error: any) {
    res.status(502).json({ success: false, error: error?.message || 'Proxy error' })
  }
}
