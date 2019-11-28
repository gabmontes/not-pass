'use strict'

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const http = require('http')
const nodemailer = require('nodemailer')
const session = require('express-session')
const socketIo = require('socket.io')

require('dotenv').config()
const apiUrl = process.env.API_URL
const emailPass = process.env.EMAIL_PASS
const emailUser = process.env.EMAIL_USER
const port = process.env.PORT
const webUrl = process.env.WEB_URL

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
app.use(bodyParser.json())
app.use(cors({ origin: true, credentials: true }))

app.get('/me', [
  function(req, res) {
    if (!req.session.authorized) {
      res.sendStatus(req.session.authCode ? 403 : 401)
      return
    }
    res.json({ email: req.session.email })
  }
])

app.post('/login', [
  function(req, res, next) {
    if (req.session.authorized) {
      res.sendStatus(200)
    }
    next()
  },
  function(req, res, next) {
    req.session.email = req.body.email
    req.session.authCode = (Math.random() * 1000000).toFixed(0)
    req.session.authorized = false
    next()
  },
  function(req, res, next) {
    const authUrl = `${apiUrl}${port ? `:${port}` : ''}/login`
    const authQuery = `sessionId=${req.session.id}&authCode=${req.session.authCode}`
    const fullUrl = `${authUrl}?${authQuery}`
    const mailOptions = {
      from: emailUser,
      to: req.session.email,
      subject: 'Login request',
      html: `
        <p>Authorize the login using the following link:</p>
        <p><a href=${fullUrl}>${fullUrl}</a></p>
        <p>Once authorized, you can close the popup.</p>
      `
    }
    transporter.sendMail(mailOptions, next)
  },
  function(req, res, next) {
    if (req.query.redirect) {
      res.redirect(303, req.query.redirect)
      return
    }
    res.sendStatus(200)
  }
])

app.get('/login', [
  function(req, res, next) {
    if (!req.query.sessionId || !req.query.authCode) {
      res.sendStatus(400)
      return
    }
    next()
  },
  function(req, res, next) {
    req.sessionStore.get(req.query.sessionId, function(err, session) {
      if (err) {
        next(err)
        return
      }
      if (!session) {
        res.redirect(303, `${webUrl}/authorization?err=noSession`)
        return
      }
      req.retrievedSession = session
      next()
    })
  },
  function(req, res, next) {
    if (req.retrievedSession.authCode !== req.query.authCode) {
      res.redirect(303, `${webUrl}/authorization?err=codeMismatch`)
      return
    }
    next()
  },
  function(req, res, next) {
    delete req.retrievedSession.authCode
    req.retrievedSession.authorized = true
    req.sessionStore.set(req.query.sessionId, req.retrievedSession, next)
  },
  function(req, res, next) {
    const socket = io.sockets.connected[req.retrievedSession.socketId]
    if (!socket) {
      res.redirect(303, `${webUrl}/authorization?message=manualRefresh`)
      return
    }
    socket.emit('authorized')
    delete req.retrievedSession.socketId
    req.sessionStore.set(req.query.sessionId, req.retrievedSession, next)
  },
  function(req, res) {
    res.redirect(303, `${webUrl}/authorization`)
  }
])

app.post('/logout', [
  function(req, res, next) {
    req.session.destroy(next)
  },
  function(req, res) {
    res.sendStatus(200)
  }
])

io.use(function(socket, next) {
  sessionMiddleware(socket.handshake, {}, next)
})
io.use(function(socket, next) {
  if (!socket.handshake.session.email) {
    next()
    return
  }
  socket.handshake.session.socketId = socket.id
  socket.handshake.session.save(next)
})

io.on('connect', function(socket) {
  if (!socket.handshake.session.email || !socket.handshake.session.authCode) {
    socket.emit('unauthorized')
    return
  }
  if (socket.handshake.session.authorized) {
    socket.emit('authorized')
  }
})

httpServer.listen(port, function() {
  console.log('API server listening on port ', port)
})
