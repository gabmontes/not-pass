import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React from 'react'

import Authorization from './components/authorization'
import Home from './components/home'
import Login from './components/login'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/authorization">
          <Authorization></Authorization>
        </Route>
        <Route path="/">
          <Home></Home>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
