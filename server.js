const path = require('path')
const express = require('express')
// const cors = require('cors')
const logger = require('morgan')

const app = express()
const port = process.env.PORT || 8261

const allowCrossDomain = ((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
      res.send(200);
    }
    else {
      next();
    }
})

// app.use(cors())
app.use(allowCrossDomain)

app.use(logger('common'))

app.use(express.static('public'))

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})
// app.set('trust proxy', true)/

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
