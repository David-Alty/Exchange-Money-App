// pages/api/exchange.js (or whatever route you're using)
// pages/api/exchange.js (or whatever route you're using)

import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const targetUrl = "https://sarafi.af/fa/exchange-rates/da-afg-bank";

    // 1. Define HTTP Headers to mimic a real browser
    const headers = {
      // Essential: A realistic User-Agent string
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      
      // Standard headers that browsers send
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    // 2. Fetch the data directly without ScraperAPI, using the configured headers
    const { data } = await axios.get(targetUrl, { headers });

    const $ = cheerio.load(data);
    const results = [];

    // 3. Scraping logic
    $("table.homeRates.exchangeRatesTable.mb-4 tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 3) {
        const flag = $(tds[0]).find("img").attr("src") || "";
        let currency = $(tds[0]).find("b").text().trim();
        const buy = $(tds[1]).find("b").text().trim();
        const sell = $(tds[2]).find("b").text().trim();

        // Fix currency names
        if (currency === "INR - روپیه هند هزار") currency = "INR - هزار روپیه هند";
        if (currency === "IRR - تومان ایران هزار") currency = "IRR - هزار تومان ایران ";
        if (currency === "PKR - روپیه پاکستان هزار") currency = "PKR - هزار روپیه پاکستان";

        if (
          currency &&
          buy &&
          sell &&
          currency !== "دالر آمریکا در مقابل تومان" &&
          currency !== "درهم امارات در مقابل تومان"
        ) {
          results.push({ currency, buy, sell, flag });
        }
      }
    });

    res.status(200).json(results);
  } catch (err) {
    console.error('Error scraping data:', err.message);
    
    // Provide specific feedback if the error is a 403 Forbidden
    if (axios.isAxiosError(err) && err.response && err.response.status === 403) {
      console.error('The direct request was forbidden (403). The website likely detected the scraper.');
    }
    
    res.status(500).json({ error: 'Scraping failed.' });
  }
}

// import axios from 'axios';
// import * as cheerio from 'cheerio';

// export default async function handler(req, res) {
//   // Enable CORS
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//   try {
//     const scraperApiKey = process.env.SCRAPER_API_KEY;
//     const targetUrl = "https://sarafi.af/fa/exchange-rates/da-afg-bank";

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
//       if (tds.length >= 3) {
//         const flag = $(tds[0]).find("img").attr("src") || "";
//         let currency = $(tds[0]).find("b").text().trim();
//         const buy = $(tds[1]).find("b").text().trim();
//         const sell = $(tds[2]).find("b").text().trim();

//         // Fix currency names
//         if (currency === "INR - روپیه هند هزار") currency = "INR - هزار روپیه هند";
//         if (currency === "IRR - تومان ایران هزار") currency = "IRR - هزار تومان ایران ";
//         if (currency === "PKR - روپیه پاکستان هزار") currency = "PKR - هزار روپیه پاکستان";

//         if (
//           currency &&
//           buy &&
//           sell &&
//           currency !== "دالر آمریکا در مقابل تومان" &&
//           currency !== "درهم امارات در مقابل تومان"
//         ) {
//           results.push({ currency, buy, sell, flag });
//         }
//       }
//     });

//     res.status(200).json(results);
//   } catch (err) {
//     console.error('Error scraping data:', err.message);
//     res.status(500).json({ error: 'Scraping failed.' });
//   }
// }
