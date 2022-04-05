const fs = require('fs'),
  http = require('http'),
  path = require('path')

const baseFolder = path.resolve(__dirname, 'www')
const indexFile = baseFolder + '/index.html'
const port = 8080

fs.readFile(indexFile, (err, index) => {
  if (err) {
    console.error('Cound not load index.html from ' + indexFile)
    process.exit(1)
  }
  http.createServer((req, res) => {
    const file = baseFolder + req.url
    fs.readFile(file, (err, data) => {
      if (err) {
        console.log('Could not find ' + file + ', falling back to ' + indexFile)
        res.writeHead(200)
        res.end(index)
        return
      }
      console.log('Serving ' + file)
      res.writeHead(200)
      res.end(data)
    })
  }).listen(port)
  console.log('Server listening at port ' + port)
})
