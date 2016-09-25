// PAGES
// - Login
// - Map
//   - Add my favorite place
//   - Show follwing's favotite place
//   - Show group favotie place
// - Following

// NAVI
// - My place
// - Following
// - Make a group

// TODOS:
// 1. update friends to Following
// 2. group structure
// 3. react update content on DOM
// 4. react redirect user to proper pages

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
      <Route path="/login" component={Login} />
      <Route path="/follow" component={AddFollower} />
      <Route path="/map" component={MapSearch} />
    </Route>
  </Router>
), document.getElementById('app'));
