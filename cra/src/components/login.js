import { useHistory } from 'react-router-dom'
import React, { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const history = useHistory()

  function handleSubmit(event) {
    event.preventDefault()
    fetch('http://localhost:3001/login', {
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
      <div>Login page</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">e-mail</label>
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
