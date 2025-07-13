// /api/sarai-shahzada.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // CORS Headers (Necessary for your API endpoint, unrelated to the scraping issue)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const targetUrl = "https://sarafi.af/fa/exchange-rates/sarai-shahzada";

    // 1. Define HTTP Headers to mimic a real browser
    const headers = {
      // Use a common User-Agent string from a recent browser. 
      // This is the most crucial header for bypassing basic blocks.
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      
      // Include standard headers that browsers send
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br', // Required for compressed responses
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    // 2. Fetch the data directly with configured headers
    const { data } = await axios.get(targetUrl, { headers });

    // 3. Load the HTML using Cheerio
    const $ = cheerio.load(data);
    const results = [];

    // 4. Scraping logic (remains the same)
    $("table.homeRates.exchangeRatesTable.mb-4 tbody tr").each((_, row) => {
      const tds = $(row).find("td");
      if (tds.length >= 3) {
        const flag = $(tds[0]).find("img").attr("src") || "";
        let currency = $(tds[0]).find("b").text().trim();
        const buy = $(tds[1]).find("b").text().trim();
        const sell = $(tds[2]).find("b").text().trim();

        // Data cleanup (remains the same)
        if (currency === "INR - روپیه هند هزار") currency = "INR - هزار روپیه هند";
        if (currency === "IRR - تومان ایران هزار") currency = "IRR - هزار تومان ایران ";
        if (currency === "PKR - روپیه پاکستان هزار") currency = "PKR - هزار روپیه پاکستان";
        if (currency === "JPY - ین جاپان هزار") currency = "JPY - هزار ین جاپان";

        if (currency && buy && sell &&
            currency !== "دالر آمریکا در مقابل تومان" &&
            currency !== "درهم امارات در مقابل تومان") {
          results.push({ currency, buy, sell, flag });
        }
      }
    });

    res.status(200).json(results);
  } catch (err) {
    // Log the error message. Note that you may still get a 403 error here.
    console.error('Error scraping sarai-shahzada:', err.message);
    
    // If the error is an Axios error with status code 403, we can log that specifically.
    if (axios.isAxiosError(err) && err.response && err.response.status === 403) {
      console.error('The request was forbidden by the target website (403).');
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
//     const targetUrl = "https://sarafi.af/fa/exchange-rates/sarai-shahzada";

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

//         if (currency === "INR - روپیه هند هزار") currency = "INR - هزار روپیه هند";
//         if (currency === "IRR - تومان ایران هزار") currency = "IRR - هزار تومان ایران ";
//         if (currency === "PKR - روپیه پاکستان هزار") currency = "PKR - هزار روپیه پاکستان";
//         if (currency === "JPY - ین جاپان هزار") currency = "JPY - هزار ین جاپان";

//         if (currency && buy && sell &&
//             currency !== "دالر آمریکا در مقابل تومان" &&
//             currency !== "درهم امارات در مقابل تومان") {
//           results.push({ currency, buy, sell, flag });
//         }
//       }
//     });

//     res.status(200).json(results);
//   } catch (err) {
//     console.error('Error scraping sarai-shahzada:', err.message);
//     res.status(500).json({ error: 'Scraping failed.' });
//   }
// }


