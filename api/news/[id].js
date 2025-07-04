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
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'GET') {
    // Read single news by ID
    const news = await News.findById(id);
    if (!news) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(news);
  } else if (req.method === 'PUT') {
    // Update news by ID
    const { title, image, description, link } = req.body;
    const updated = await News.findByIdAndUpdate(
      id,
      { title, image, description, link },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(updated);
  } else if (req.method === 'DELETE') {
    // Delete news by ID
    const deleted = await News.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}