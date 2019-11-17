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
    console.log('Initializing session')
    req.session.email = req.body.email
    req.session.code = (Math.random() * 1000000).toFixed(0)
    req.session.validated = false
    next()
  },
  function(req, res, next) {
    console.log('Sending email')
    const mailOptions = {
      from: emailUser,
      to: req.body.email,
      subject: 'Login',
      html: `<a href="${baseUrl}:${port}/login?&sessionId=${req.session.id}&code=${req.session.code}">Login</a>`
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
    req.sessionStore.get(req.query.sessionId, function(err, session) {
      req.retrievedSession = session
      next(err)
    })
  },
  function(req, res, next) {
    if (req.query.code !== req.retrievedSession.code) {
      console.log('Invalid code')
      res.redirect(303, `${baseUrl}:${webPort}/sorry.html`)
      return
    }
    next()
  },
  function(req, res, next) {
    console.log('Retrieving socket')
    io.sockets.connected[req.retrievedSession.socketId].emit('login')
    next()
  },
  function(req, res, next) {
    console.log('Valid code')
    delete req.retrievedSession.code
    delete req.retrievedSession.socketId
    req.retrievedSession.validated = true
    req.sessionStore.set(req.query.sessionId, req.retrievedSession, next)
  },
  function(req, res) {
    res.redirect(303, `${baseUrl}:${webPort}/thanks.html`)
  }
])

app.get('/debug', function(req, res) {
  res.json(req.session)
})

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
