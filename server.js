const path = require('path')
const express = require('express')
const cors = require('cors')
const logger = require('morgan')

const app = express()
const port = process.env.PORT || 8261

app.use(cors())
app.use(logger('common'))
app.use(express.static('public'))
// app.set('trust proxy', true)

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

app.listen(port, error => {
  if (error) {
    console.error(error)
  } else {
    console.info(
      '==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.',
      port,
      port
    )
  }
})
