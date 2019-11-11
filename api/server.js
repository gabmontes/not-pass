'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const nodemailer = require('nodemailer')
const session = require('express-session')
const socketIo = require('socket.io')

require('dotenv').config()

const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASS
const port = process.env.PORT
const webPort = process.env.WEB_PORT
const baseUrl = process.env.BASE_URL

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: emailUser, pass: emailPass }
})

const app = express()
const httpServer = http.createServer(app)
const io = socketIo(httpServer)

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
})
app.use(sessionMiddleware)
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', [
  function(req, res, next) {
    if (!req.body.email) {
      console.log('No email received')
      res.end(400)
      return
    }
    next()
  },
  function(req, res, next) {
    console.log('Initializing session')
    req.session.email = req.body.email
    req.session.otp = (Math.random() * 1000000).toFixed(0)
    next()
  },
  function(req, res, next) {
    console.log('Sending email')
    const mailOptions = {
      from: emailUser,
      to: req.body.email,
      subject: 'Login',
      html: `<a href="${baseUrl}:${port}/login?otp=${req.session.otp}">Login</a>`
    }
    transporter.sendMail(mailOptions, next)
  },
  function(req, res, next) {
    console.log('Email sent')
    res.redirect(303, `${baseUrl}:${webPort}/waiting.html`)
  }
])

app.get('/login', [
  function(req, res, next) {
    if (!req.query.otp) {
      console.log('No OTP')
      res.end(400)
      return
    }
    next()
  },
  function(req, res, next) {
    if (req.query.otp !== req.session.otp) {
      console.log('Invalid OTP')
      res.redirect(303, `${baseUrl}:${webPort}/sorry.html`)
      return
    }
    next()
  },
  function(req, res, next) {
    console.log('Retrieving socket')
    io.sockets.connected[req.session.socketId].emit('login')
    next()
  },
  function(req, res, next) {
    console.log('Valid OTP')
    delete req.session.otp
    req.session.validated = true
    res.redirect(303, `${baseUrl}:${webPort}/thanks.html`)
  }
])

io.use(function(socket, next) {
  console.log('Parsing session')
  sessionMiddleware(socket.handshake, {}, next)
})

io.use(function(socket, next) {
  if (!socket.handshake.session.email) {
    next()
    return
  }
  console.log('Saving reference to socket')
  socket.handshake.session.socketId = socket.id
  socket.handshake.session.save(next)
})

httpServer.listen(port, function() {
  console.log('API server listening on port ', port)
})
