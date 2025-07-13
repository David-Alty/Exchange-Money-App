// /api/other-currencies.js
// /api/other-currencies.js (assuming a separate file or endpoint)

import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const targetUrl = "https://sarafi.af/fa/exchange-rates/other-currencies";

    // Configure headers to mimic a real browser
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    // Fetch the data directly without ScraperAPI, using the configured headers
    const { data } = await axios.get(targetUrl, { headers });

    const $ = cheerio.load(data);
    const results = [];

    // The scraping logic remains the same
    $("table.homeRates.exchangeRatesTable.mb-4 tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 7) {
        const flag = $(tds[0]).find("img").attr("src") || "";
        const currency = $(tds[0]).find("b").text().trim();
        const buy = $(tds[1]).text().trim();
        const sell = $(tds[2]).text().trim();
        const time = $(tds[3]).text().trim();
        const change = $(tds[4]).text().trim();
        const area = $(tds[6]).text().trim();

        results.push({ currency, buy, sell, time, change, area, flag });
      }
    });

    res.status(200).json(results);
  } catch (err) {
    console.error('Error scraping other-currencies:', err.message);
    
    // Check if the error is a 403 Forbidden specifically
    if (axios.isAxiosError(err) && err.response && err.response.status === 403) {
      console.error('Failed to bypass anti-bot measures. The request was forbidden (403).');
    }

    res.status(500).json({ error: 'Scraping failed.' });
  }
}
// import axios from 'axios';
// import * as cheerio from 'cheerio';

// export default async function handler(req, res) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   try {
//     const scraperApiKey = process.env.SCRAPER_API_KEY;
//     const targetUrl = "https://sarafi.af/fa/exchange-rates/other-currencies";

//     const { data } = await axios.get("http://api.scraperapi.com", {
//       params: {
//         api_key: scraperApiKey,
//         url: targetUrl
//       }
//     });

//     const $ = cheerio.load(data);
//     const results = [];

//     $("table.homeRates.exchangeRatesTable.mb-4 tbody tr").each((_, row) => {
//       const tds = $(row).find("td");
//       if (tds.length >= 7) {
//         const flag = $(tds[0]).find("img").attr("src") || "";
//         const currency = $(tds[0]).find("b").text().trim();
//         const buy = $(tds[1]).text().trim();
//         const sell = $(tds[2]).text().trim();
//         const time = $(tds[3]).text().trim();
//         const change = $(tds[4]).text().trim();
//         const area = $(tds[6]).text().trim();

//         results.push({ currency, buy, sell, time, change, area, flag });
//       }
//     });

//     res.status(200).json(results);
//   } catch (err) {
//     console.error('Error scraping other-currencies:', err.message);
//     res.status(500).json({ error: 'Scraping failed.' });
//   }
// }
