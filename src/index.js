import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import './utils/Config';
import App from './components/App';
import store from './store/GDNetHomeClientStore.js';
import '@fortawesome/fontawesome-free/css/all.css';

console.log("Starting");
render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={App}/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
