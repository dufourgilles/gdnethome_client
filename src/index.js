import React from 'react';
import './utils/Config';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import App from './components/App';
import store from './store/GDNetHomeClientStore.js';
import '@fortawesome/fontawesome-free/css/all.css';
// import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './utils/Config';
import 'antd/dist/antd.css';

console.log("Starting");
render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path="/" component={App}/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
