import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React from 'react'

import Authorized from './components/authorized'
import Home from './components/home'
import Login from './components/login'
import Unauthorized from './components/unauthorized'
import Waiting from './components/waiting'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/waiting">
          <Waiting></Waiting>
        </Route>
        <Route path="/authorized">
          <Authorized></Authorized>
        </Route>
        <Route path="/unauthorized">
          <Unauthorized></Unauthorized>
        </Route>
        <Route path="/">
          <Home></Home>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
