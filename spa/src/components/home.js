import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

const apiUrl = process.env.REACT_APP_API_URL

function Home() {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(function() {
    fetch(`${apiUrl}/me`, { credentials: 'include' })
      .then(function(res) {
        if (res.status >= 400) {
          return
        }
        return res.json().then(function(user) {
          setEmail(user.email)
          setAuthorized(true)
        })
      })
      .then(function() {
        setLoading(false)
      })
  }, [])

  const history = useHistory()

  function handleLogin() {
    history.push('/login')
  }

  function handleLogout() {
    fetch(`${apiUrl}/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(function() {
      setAuthorized(false)
    })
  }

  return loading ? (
    <div>
      <div>Loading...</div>
    </div>
  ) : authorized ? (
    <div>
      <div>Welcome</div>
      <div>{email}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  ) : (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Home
