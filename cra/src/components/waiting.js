import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import React, { useEffect } from 'react'

function Waiting() {
  console.log('Waiting')
  const history = useHistory()

  useEffect(
    function() {
      console.log('Connecting')
      const socket = io('http://localhost:3001')

      socket.on('login', function() {
        console.log('Logged in')
        history.push('/')
      })

      return function() {
        console.log('Disconnecting')
        socket.close()
      }
    },
    [history]
  )

  return (
    <div>
      <div>Waiting email authentication</div>
    </div>
  )
}

export default Waiting
