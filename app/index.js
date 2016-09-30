import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { render } from 'react-dom'
import App from './components/app'
import Login from './components/login'
import MapSearch from './components/mapsearch'
import AddFollower from './components/addfollower'
import './style.css'

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Login} />
      <Route path="/login" header="Welcome!" component={Login} />
      <Route path="/follow" header="Manage Followers" component={AddFollower} />
      <Route path="/map" header="Favorite Map" component={MapSearch} />
    </Route>
  </Router>
), document.getElementById('app'));
