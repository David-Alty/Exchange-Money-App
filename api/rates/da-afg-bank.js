import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { data } = await axios.get("https://sarafi.af/fa/exchange-rates/da-afg-bank", {
      // Add the headers object here to mimic a browser
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const results = [];
    $("table.homeRates.exchangeRatesTable.mb-4 tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 3) {
        const flag = $(tds[0]).find("img").attr("src") || "";
        let currency = $(tds[0]).find("b").text().trim();
        const buy = $(tds[1]).find("b").text().trim();
        const sell = $(tds[2]).find("b").text().trim();

        // Fix currency names
        if (currency === "INR - روپیه هند هزار") {
          currency = "INR - هزار روپیه هند";
        }
        if (currency === "IRR - تومان ایران هزار") {
          currency = "IRR - هزار تومان ایران هند";
        }
        if (currency === "PKR - روپیه پاکستان هزار") {
          currency = "PKR - هزار روپیه پاکستان";
        }
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
    // Log the specific error message for debugging in Vercel logs
    console.error('Error fetching data from sarafi.af (da-afg-bank):', err.message);
    res.status(500).json({ error: 'Failed to fetch data from external source.' });
  }
}