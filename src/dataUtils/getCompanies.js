const https = require('https')

const axios = require('axios')

// can't use FMP's sp500 api call. reason = not free
const testing = async () => {
  let res = await axios.get(
    'https://financialmodelingprep.com/api/v3/sp500_constituent?apikey=b3412ad77db21aff4171c8a75831ce47'
  )
  // let data = await res.json()
  console.log('res', res)
  // console.log('data', data)
}

testing()
