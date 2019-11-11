'use strict'

const express = require('express')

require('dotenv').config()

const port = process.env.PORT

const app = express()

app.use(express.static('public'))

app.listen(port, function() {
  console.log('Web server listening on port ', port)
})
