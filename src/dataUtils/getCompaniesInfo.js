/*
reference: https://analyticsindiamag.com/puppeteer-web-scraping/
*/

const puppeteer = require('puppeteer')
const fs = require('fs')

async function getSP500() {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(
      'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies',
      { waitUntil: 'domcontentloaded' }
    )

    const recordList = await page.$$eval(
      'table#constituents tbody tr',
      (trows) => {
        let rowList = []
        trows.forEach((row) => {
          let record = {
            symbol: '',
            name: '',
            sector: '',
            subSector: '',
            headquarterLocation: '',
            dateFirstAdded: '',
            cik: '',
            founded: '',
          }

          const tdList = Array.from(
            row.querySelectorAll('td'),
            (column) => column.innerText
          )
          record.symbol = tdList[0]
          record.name = tdList[1]
          record.sector = tdList[3]
          record.subSector = tdList[4]
          record.headquarterLocation = tdList[5]
          record.dateFirstAdded = tdList[6]
          record.cik = tdList[7]
          record.founded = tdList[8]
          if (tdList.length > 0) {
            // this prevents pushing empty object into list
            rowList.push(record)
          }
        })
        return rowList
      }
    )

    fs.writeFile(
      'src/companiesInfo.json',
      JSON.stringify(recordList),
      (err) => {
        if (err) {
          console.error(error)
        } else {
          console.log('File successfully created')
        }
      }
    )
    await browser.close()
  } catch (error) {
    console.error(error)
  }
}

getSP500()
