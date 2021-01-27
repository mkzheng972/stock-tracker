const rawData = require('./prices.json')

let map = {}
for (let company of rawData) {
  let { sector, c, pc } = company
  // check for percent change
  let percentChange = 0
  if (c > pc) {
    percentChange = ((c - pc) / pc) * 100
  } else if (c < pc) {
    percentChange = ((pc - c) / c) * 100 * -1
  }
  company.percent_change_24hr = +percentChange.toFixed(2)

  let priceChange = c - pc
  company.price_change_24hr = +priceChange.toFixed(2)

  if (map[sector] === undefined) {
    map[sector] = []
  }
  map[sector].push(company)
}

const obj = {
  name: 's&p500',
}

let childrenArr = []
for (let sector in map) {
  let subObj = {
    name: sector,
    children: map[sector],
  }
  childrenArr.push(subObj)
}

obj.children = childrenArr

const fs = require('fs')

fs.writeFile('src/modifed-data.js', JSON.stringify(obj), 'utf8', (err) => {
  if (err) {
    throw err
  }
  console.log('File created')
})
