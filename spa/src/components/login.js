import { useHistory } from 'react-router-dom'
import React, { useState } from 'react'

const apiUrl = process.env.REACT_APP_API_URL

function Login() {
  const [email, setEmail] = useState('')
  const history = useHistory()

  function handleSubmit(event) {
    event.preventDefault()
    fetch(`${apiUrl}/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    }).then(function() {
      history.push('/waiting')
    })
  }

  return (
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
