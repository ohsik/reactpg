import React from 'react';
import { render } from 'react-dom';
import * as firebase from 'firebase';
import App from './components/app';
import './style.css';

const config = {
  apiKey: "AIzaSyAOZoeHLYWh6B2-RcwDx1Ik8mcj1Dt95GM",
  authDomain: "playground-edcc3.firebaseapp.com",
  databaseURL: "https://playground-edcc3.firebaseio.com",
  storageBucket: "",
};

render(
  <App />,
  document.getElementById('app')
);
