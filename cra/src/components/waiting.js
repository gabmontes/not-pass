import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import React, { useEffect } from 'react'

function Waiting() {
  const history = useHistory()

  useEffect(
    function() {
      const socket = io('http://localhost:3001')

      socket.on('login', function() {
        history.push('/')
      })
      socket.on('relogin', function() {
        history.push('/login')
      })

      return function() {
        socket.close()
      }
    },
    [history]
  )

  return (
    <div>
      <div>Waiting e-mail authorization...</div>
    </div>
  )
}

export default Waiting
