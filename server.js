const fs = require('fs'),
  http = require('http'),
  path = require('path')

const baseFolder = path.resolve(__dirname, 'dist')

fs.readFile(baseFolder + '/index.html', (err, index) => {
  if (err) {
    process.exit(1)
  }
  http.createServer((req, res) => {
    fs.readFile(baseFolder + req.url, (err, data) => {
      if (err) {
        res.writeHead(200)
        res.end(index)
        return
      }
      res.writeHead(200)
      res.end(data)
    })
  }).listen(8080)
})
