'use strict'

const fs = require('fs')
const glob = require('glob')
const handlebars = require('handlebars')

require('dotenv').config()

const apiUrl = process.env.API_URL
const port = process.env.PORT

const files = glob.sync('templates/*.html')
files.forEach(function(file) {
  const newFile = file.replace('templates', 'public')
  const template = fs.readFileSync(file, 'utf8')
  const compiled = handlebars.compile(template)({ apiUrl, port })
  fs.writeFileSync(newFile, compiled, 'utf8')
})
