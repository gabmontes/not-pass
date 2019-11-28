import React from 'react'
import { useLocation } from 'react-router-dom'

function Authorized() {
  const query = new URLSearchParams(useLocation().search)
  const err = query.get('err')

  return (
    <div>
      <div>E-mail authorization {err ? 'failed' : 'succeded'}</div>
    </div>
  )
}

export default Authorized
