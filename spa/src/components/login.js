import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import React, { useEffect, useState } from 'react'

const apiUrl = process.env.REACT_APP_API_URL

function Login() {
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [waitingAuth, setWaitingAuth] = useState(false)

  const history = useHistory()

  useEffect(
    function() {
      fetch(`${apiUrl}/me`, { credentials: 'include' })
        .then(function(res) {
          if (res.status === 401) {
            return
          }
          if (res.status === 403) {
            setWaitingAuth(true)
            return
          }
          return res.json().then(function(user) {
            history.push('/')
          })
        })
        .then(function() {
          setLoading(false)
        })
    },
    [history]
  )

  useEffect(
    function() {
      if (!waitingAuth) {
        return
      }

      const socket = io(apiUrl)

      socket.on('authorized', function() {
        history.push('/')
      })
      socket.on('unauthorized', function() {
        history.push('/login')
      })

      return function() {
        socket.close()
      }
    },
    [waitingAuth, history]
  )

  function handleSubmit(event) {
    event.preventDefault()
    fetch(`${apiUrl}/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    }).then(function() {
      setWaitingAuth(true)
    })
  }

  return loading ? (
    <div>
      <div>Loading...</div>
    </div>
  ) : waitingAuth ? (
    <div>
      <div>Waiting e-mail authorization...</div>
    </div>
  ) : (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button>Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login
