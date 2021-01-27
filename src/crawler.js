/* https://www.scrapingbee.com/blog/web-scraping-javascript/

getVisual creates a instance of a browser (chromium in this case) via puppeteer.launch(), and a new page is created as well like a tab on a browser. The page created is directed to the URL specificed by page.goto(URL) and takes screenshot and pdf of the page.
*/

const puppeteer = require('puppeteer')

async function getVisual(urlStr) {
  try {
    const URL = urlStr
    const browser = await puppeteer.launch() // initiate browser instance
    const page = await browser.newPage() // creates new blank page

    await page.goto(URL) // navigate to url
    await page.screenshot({ path: 'screenshot.png' }) // takes screenshot of current page
    await page.pdf({ path: 'page.pdf' }) // downloads a pdf of page
    await browser.close() // closes browser instance
  } catch (error) {
    console.error(error)
  }
}
// getVisual('https://www.reddit.com/r/programming/')
