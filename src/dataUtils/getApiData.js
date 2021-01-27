const companies = require('./companyInfo.json')
const axios = require('axios')
const fs = require('fs')

// // Returns a Promise that resolves after "ms" Milliseconds
const timer = (ms) => new Promise((res) => setTimeout(res, ms))

let arr = []

async function getData() {
  try {
    let count = 1
    for (let i = 0; i < companies.length; i++) {
      let company = companies[i]
      let id = company.symbol

      async function getPrice(id) {
        try {
          let response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${id}&token=c03h9if48v6sogn2jb3g`
          )
          let data = response.data
          data.name = company.name
          data.sector = company.sector
          data.subSector = company.subSector
          data.symbol = company.symbol
          data.number = 240
          data.current = data.c
          data.open = data.o
          data.high = data.h
          data.low = data.l
          data.previous_close = data.pc
          arr.push(data)
        } catch (error) {
          console.error(error)
        }
      }

      await getPrice(id)
      if (i !== 0 && i % 59 === 0) {
        console.log(i, count)
        count += 1
        await timer(60000)
      }
    }
  } catch (error) {
    console.error(error)
  }

  fs.writeFile('prices.json', JSON.stringify(arr), 'utf8', (err) => {
    if (err) throw err
    console.log('File created!')
  })
}
getData()

/*
// Returns a Promise that resolves after "ms" Milliseconds
const timer = (ms) => new Promise((res) => setTimeout(res, ms))

async function load() {
  // We need to wrap the loop into an async function for this to work
  for (var i = 0; i < 100; i++) {
    console.log(i)
    if (i !== 0 && i % 20 === 0) {
      await timer(3000) // then the created Promise can be awaited
    }
  }
}

load()
*/
