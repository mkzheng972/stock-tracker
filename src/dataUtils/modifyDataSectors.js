const rawApiData = require('./prices.json')
const fs = require('fs')
/*

layout:

obj = {
  name: sp500,
  children: [
    {
      name: sectorName
      children: [
        name: subSectorName
        children: [
          {stockObj}
        ]
      ]
    }
  ]
}

*/

const obj = {
  name: 'sp500',
  children: [],
}

const sectors = {
  // 'sectorName' : {
  //   'subSectorName' : []
  // }
}

// mapped by sector['sectorName']['subSectorName']
for (let stock of rawApiData) {
  let { sector, subSector, c, pc } = stock

  // check for percent change, c = current, pc = previous close
  let percentChange = 0
  let priceChange = c - pc
  if (c > pc) {
    percentChange = ((c - pc) / pc) * 100
  } else if (c < pc) {
    percentChange = ((pc - c) / c) * 100 * -1
  }
  stock.percent_change_24hr = +percentChange.toFixed(2)
  stock.price_change_24hr = +priceChange.toFixed(2)

  // below creates the data structure layout
  if (sectors[sector] === undefined) {
    sectors[sector] = {}
  }
  let currentSector = sectors[sector]
  if (currentSector[subSector] === undefined) {
    currentSector[subSector] = []
  }
  currentSector[subSector].push(stock)
}

// console.log(sectors['Industrials']['Airlines'])
// console.log(sectors)

for (let sector in sectors) {
  let sectorObj = {
    name: sector,
    children: [], //sectors[sector],
  }
  for (let subSector in sectors[sector]) {
    let subSectorObj = {
      name: subSector,
      children: sectors[sector][subSector],
    }
    sectorObj.children.push(subSectorObj)
  }
  obj.children.push(sectorObj)
}

// console.log(obj)
// console.log(Array.isArray(obj.children[0].children))

fs.writeFile('src/modifedData.json', JSON.stringify(obj), (err) => {
  if (err) {
    console.error(err)
  }
  console.log('Modified data file created')
})
