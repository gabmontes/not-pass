import { useHistory } from 'react-router-dom'
import React from 'react'

function Home() {
  const history = useHistory()

  function handleClick() {
    history.push('/login')
  }

  return (
    <div>
      <div>Home page</div>
      <button onClick={handleClick}>Login</button>
    </div>
  )
}

export default Home

// TODO loading then login or welcome + logout
