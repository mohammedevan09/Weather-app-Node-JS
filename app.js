const http = require('http')
const fs = require('fs')
var requests = require('requests')

const homeFile = fs.readFileSync('./index.html', 'utf-8')
// console.log(homeFile)

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace('{%tempVal%}', orgVal.main.temp)
  temperature = temperature.replace('{%tempMin%}', orgVal.main.temp_min)
  temperature = temperature.replace('{%tempMax%}', orgVal.main.temp_max)
  temperature = temperature.replace('{%country%}', orgVal.sys.country)
  temperature = temperature.replace('{%location%}', orgVal.name)
  temperature = temperature.replace('{%tempStatus%}', orgVal.weather[0].main)
  // console.log(temperature)
  return temperature
}

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    requests(
      'https://api.openweathermap.org/data/2.5/weather?q=dhaka&appid=11e4d814d389ff7054e9e73ebeeb9d02'
    )
      .on('data', (chunk) => {
        const objData = JSON.parse(chunk)
        const arrData = [objData]
        console.log(arrData[0].main.temp)
        // console.log(chunk)
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join('')

        // Save the updated data to index.html file
        fs.writeFileSync('./index.html', realTimeData)

        // Send the updated index.html file as response
        res.write(realTimeData)
        // console.log(realTimeData)
      })

      .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err)
        res.end()
      })
  }
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
