// /api/khorasan-market.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const scraperApiKey = process.env.SCRAPER_API_KEY;
    const targetUrl = "https://sarafi.af/fa/exchange-rates/khorasan-market";

    const { data } = await axios.get("http://api.scraperapi.com", {
      params: {
        api_key: scraperApiKey,
        url: targetUrl
      }
    });

    const $ = cheerio.load(data);
    const allResults = [];

    $("tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 3) {
        const flag = $(tds[0]).find("img").attr("src") || "";
        let currency = $(tds[0]).find("b").text().trim();
        const buy = $(tds[1]).find("b").text().trim();
        const sell = $(tds[2]).find("b").text().trim();

        if (currency === "IRR - تومان ایران هزار") currency = "IRR - هزار تومان ایران هند";
        if (currency === "PKR - روپیه پاکستان هزار") currency = "PKR - هزار روپیه پاکستان";

        if (currency && buy && sell) {
          allResults.push({ currency, buy, sell, flag });
        }
      }
    });

    const firstRow = allResults.length > 0 ? allResults[0] : null;
    const remainingRows = allResults.slice(1);

    res.status(200).json({ firstRow, remainingRows });
  } catch (err) {
    console.error('Error scraping khorasan-market:', err.message);
    res.status(500).json({ error: 'Scraping failed.' });
  }
}
