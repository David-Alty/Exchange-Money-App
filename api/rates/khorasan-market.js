import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  try {
    const { data } = await axios.get("https://sarafi.af/fa/exchange-rates/khorasan-market");
    const $ = cheerio.load(data);
    const results = [];
    $("tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 3) {
        const flag = $(tds[0]).find("img").attr("src") || "";
        const currency = $(tds[0]).find("b").text().trim();
        const buy = $(tds[1]).find("b").text().trim();
        const sell = $(tds[2]).find("b").text().trim();
        results.push({ currency, buy, sell, flag });
      }
    });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}