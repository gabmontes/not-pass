import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import React, { useEffect } from 'react'

const apiUrl = process.env.REACT_APP_API_URL

function Waiting() {
  const history = useHistory()

  useEffect(
    function() {
      const socket = io(apiUrl)

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
