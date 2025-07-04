import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { data } = await axios.get("https://sarafi.af/fa/exchange-rates/other-currencies", {
      // Add the headers object here
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];
    $("table.homeRates.exchangeRatesTable.mb-4 tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 7) { // Ensure enough columns are present
        const flag = $(tds[0]).find("img").attr("src") || "";
        const currency = $(tds[0]).find("b").text().trim();
        const buy = $(tds[1]).text().trim();
        const sell = $(tds[2]).text().trim();
        const time = $(tds[3]).text().trim();
        const change = $(tds[4]).text().trim();
        const area = $(tds[6]).text().trim(); // Make sure index 6 is correct for 'area'

        results.push({ currency, buy, sell, time, change, area, flag });
      }
    });
    res.status(200).json(results);
  } catch (err) {
    // Log the specific error message for debugging in Vercel logs
    console.error('Error fetching data from sarafi.af (other-currencies):', err.message);
    res.status(500).json({ error: 'Failed to fetch data from external source.' });
  }
}