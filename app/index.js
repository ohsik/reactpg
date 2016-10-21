import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { render } from 'react-dom'
import App from './components/app'
import Login from './components/login'
import MapSearch from './components/mapsearch'
import AddFollower from './components/addfollower'
import MyProfile from './components/myprofile'
import Groups from './components/groups'
import Group from './components/group'
import './style.css'

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute cc="login" header="Share your favorites!" component={Login} />
      <Route path="/login" cc="login" header="Please Login to continue..." component={Login} />
      <Route path="/follow" cc="follow" header="Manage Follow" component={AddFollower} />
      <Route path="/map" cc="map" header="Favorite Restaurants" component={MapSearch} />
      <Route path="/profile" cc="profile" header="My Profile" component={MyProfile} />
      <Route path="/group" cc="group" header="Manage Group" component={Groups} />
      <Route path="group/:group" cc="manage-group" header="Manage Group" component={Group} />
    </Route>
  </Router>
), document.getElementById('app'));
