import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
   
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  const hash = process.env.ADMIN_PASSWORD_HASH; // Set this in Vercel dashboard

  if (!password || !hash) return res.status(400).json({ error: 'Missing data' });

  const valid = await bcrypt.compare(password, hash);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  // For demo: return a simple token (for real use, sign a JWT or set a cookie)
  res.status(200).json({ token: 'admin-auth-ok' });
}