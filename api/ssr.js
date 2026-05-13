import { reqHandler } from '../dist/ride-on-demand/server/server.mjs';

export default async function handler(req, res) {
  try {
    await reqHandler(req, res);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

