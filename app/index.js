import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { render } from 'react-dom'
import App from './components/app'
import Login from './components/login'
import MapSearch from './components/mapsearch'
import AddFriends from './components/addfriends'
import './style.css'

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/add-friends" component={AddFriends} />
      <Route path="/map" component={MapSearch} />
    </Route>
  </Router>
), document.getElementById('app'));
