const fs = require('fs'),
  http = require('http'),
  path = require('path')

const baseFolder = path.resolve(__dirname, 'www')
const indexFile = baseFolder + '/index.html'
const port = 8080

const mimeTypes = {
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.png': 'image/x-png',
  '.txt': 'text/plain',
}

const getMimeType = (url) => {
  const ext = url.substring(url.lastIndexOf('.'))
  return mimeTypes[ext]
}

const writeResponse = (res, data, mimeType) => {
  res.writeHead(200, mimeType ? { 'Content-Type': mimeType } : undefined)
  res.end(data)
}

fs.readFile(indexFile, (err, index) => {
  if (err) {
    console.error('Cound not load index.html from ' + indexFile)
    process.exit(1)
  }
  http.createServer((req, res) => {
    const file = baseFolder + req.url
    fs.readFile(file, (err, data) => {
      if (err) {
        console.log(`Could not find ${file}, falling back to ${indexFile}`)
        writeResponse(res, index, mimeTypes['.html'])
        return
      }
      const mimeType = getMimeType(req.url)
      console.log(`Serving ${file} (${mimeType})`)
      writeResponse(res, data, mimeType)
    })
  }).listen(port)
  console.log('Server listening at port ' + port)
})
