import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import React from 'react'

import './App.css'
import Home from './components/home'
import Login from './components/login'
import Success from './components/success'
import Waiting from './components/waiting'

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/success">
          <Success></Success>
        </Route>
        <Route path="/waiting">
          <Waiting></Waiting>
        </Route>
        <Route path="/">
          <Home></Home>
        </Route>
      </Switch>
    </Router>
  )
}

export default App
