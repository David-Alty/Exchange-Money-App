import dbConnect from '../../lib/mongodb.js';
import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true }
}, { timestamps: true });

const News = mongoose.models.News || mongoose.model('News', NewsSchema);
export default async function handler(req, res) {
  try {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    await dbConnect();

    if (req.method === 'POST' && !req.body.title) {
      let body = '';
      await new Promise((resolve) => {
        req.on('data', chunk => { body += chunk; });
        req.on('end', resolve);
      });
      req.body = JSON.parse(body || '{}');
    }

    if (req.method === 'GET') {
      const news = await News.find().sort({ createdAt: -1 });
      res.status(200).json(news);
    } else if (req.method === 'POST') {
      const { title, image, description, link } = req.body;
      if (!title || !image || !description || !link) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      const created = await News.create({ title, image, description, link });
      res.status(201).json(created);
    } else {
      res.status(405).end();
    }
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}