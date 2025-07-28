Exchange Money App
This project is a web application designed to fetch and display real-time exchange rates from various markets in Afghanistan, specifically from sarafi.af. It provides API endpoints to access currency exchange data from Sarai Shahzada, Khorasan Market, and Da Afghanistan Bank.

🌟 Features
Real-time Exchange Rates: Fetches up-to-date buying and selling rates for various currencies.

Multiple Market Sources: Gathers data from:

Sarai Shahzada

Khorasan Market

Da Afghanistan Bank

API Endpoints: Exposes dedicated API routes for each market, allowing easy integration with other applications.

Currency Normalization: Standardizes some currency names for consistency.

CORS Enabled: API endpoints are configured to allow cross-origin requests.

💻 Technologies Used
Node.js: JavaScript runtime environment.

Next.js (or similar framework for API routes): Provides the API route structure (assuming this is built on Next.js due to pages/api structure).

Axios: Promise-based HTTP client for making web requests.

Cheerio: Fast, flexible, and lean implementation of core jQuery specifically designed for the server to parse and manipulate HTML.

Vercel: Cloud platform for static sites and Serverless Functions, used for deployment.

🚀 Setup and Installation
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (v14 or higher recommended)

npm (Node Package Manager) or Yarn

Steps
Clone the repository:

git clone <repository-url>
cd Exchange-Money-App

Install dependencies:

npm install
# or
yarn install

Set up Environment Variables:
Create a .env.local file in the root of your project. While the current code attempts direct scraping without ScraperAPI, a SCRAPER_API_KEY was previously used. If you decide to revert to using ScraperAPI (which might be necessary if direct scraping fails), you would add your key here:

# If you later decide to use ScraperAPI again:
# SCRAPER_API_KEY="your_scraperapi_key_here"

Note on Scraping: The sarafi.af website employs anti-bot measures. The current API endpoints attempt to bypass these by mimicking a real browser using various HTTP headers. However, direct scraping can still be blocked. If you encounter 403 Forbidden errors, consider:

Using a dedicated web scraping API (like ScraperAPI, Bright Data, ZenRows) and configuring your .env.local file with the respective API key.

Implementing more advanced anti-bot techniques (e.g., rotating user agents, using headless browsers like Puppeteer/Playwright if the content is JavaScript-rendered).

Run the development server:

npm run dev
# or
yarn dev

The application will typically be accessible at http://localhost:3000 (or another port if specified).

🌐 API Endpoints
The project exposes the following API endpoints to retrieve exchange rate data:

1. /api/sarai-shahzada
URL: http://localhost:3000/api/sarai-shahzada

Description: Fetches exchange rates from the Sarai Shahzada market.

Method: GET

Response (JSON Array):

[
  {
    "currency": "USD - دالر آمریکا",
    "buy": "70.00",
    "sell": "70.50",
    "flag": "https://sarafi.af/assets/flags/us.png"
  },
  // ... other currencies
  {
    "currency": "INR - هزار روپیه هند",
    "buy": "0.85",
    "sell": "0.90",
    "flag": "https://sarafi.af/assets/flags/in.png"
  }
]

2. /api/khorasan-market
URL: http://localhost:3000/api/khorasan-market

Description: Fetches exchange rates from the Khorasan Market.

Method: GET

Response (JSON Object):

{
  "firstRow": {
    "currency": "USD - دالر آمریکا",
    "buy": "70.10",
    "sell": "70.60",
    "flag": "https://sarafi.af/assets/flags/us.png"
  },
  "remainingRows": [
    {
      "currency": "EUR - یورو",
      "buy": "75.00",
      "sell": "75.50",
      "flag": "https://sarafi.af/assets/flags/eu.png"
    },
    // ... other currencies
    {
      "currency": "PKR - هزار روپیه پاکستان",
      "buy": "0.25",
      "sell": "0.30",
      "flag": "https://sarafi.af/assets/flags/pk.png"
    }
  ]
}

3. /api/da-afg-bank
URL: http://localhost:3000/api/da-afg-bank

Description: Fetches exchange rates from Da Afghanistan Bank.

Method: GET

Response (JSON Array):

[
  {
    "currency": "USD - دالر آمریکا",
    "buy": "69.90",
    "sell": "70.40",
    "flag": "https://sarafi.af/assets/flags/us.png"
  },
  // ... other currencies
]

🚀 Deployment (Vercel)
This project is designed to be easily deployed on Vercel.

Connect your Git Repository: Link your GitHub, GitLab, or Bitbucket repository to Vercel.

Automatic Deployments: Vercel automatically creates a "Preview Deployment" for every push to a feature branch or Pull Request.

Promote to Production: To make your application live and accessible via your custom domain, you need to "Promote to Production."

Automatic: By default, merging changes to your production branch (commonly main) will trigger a production deployment automatically.

Manual: You can also manually promote a specific Preview Deployment to production from your Vercel dashboard. This is useful for QA-approved versions or specific releases.

Environment Variables: Remember to configure your production environment variables (e.g., SCRAPER_API_KEY if used) in your Vercel project settings.

Vercel Free Plan Limits: Be aware that Vercel's free "Hobby" plan has limits on the number of deployments per day (e.g., 100 deployments) and per hour. Exceeding these limits can temporarily pause your deployments.

⚠️ Troubleshooting
Error scraping data: Request failed with status code 403: This is the most common issue. It means the target website (sarafi.af) is blocking your scraping request.

Cause: The website's anti-bot measures have detected your scraper. This can happen due to the IP address, user agent, lack of proper browser headers, or other fingerprinting techniques.

Solution:

Verify your scraping API (if using): Ensure your SCRAPER_API_KEY is valid and you have sufficient credits.

Adjust headers: The current code includes basic browser-mimicking headers. Websites constantly update their anti-bot measures, so these might become outdated. You might need to add more headers (e.g., Referer, Sec-Fetch-Site, Sec-Fetch-Mode) or rotate User-Agent strings.

Consider a dedicated scraping API: For highly protected sites, a specialized scraping API (like ScraperAPI, Bright Data, ZenRows) that handles proxy rotation, CAPTCHA solving, and advanced browser emulation is often the most reliable solution, though typically not free for unlimited usage.

Implement delays: For multiple requests, add delays between them to mimic human browsing behavior and avoid rate limiting.

📄 License
This project is open-source and available under the MIT License.

📧 Contact
For any questions or feedback, please open an issue in this repository.
