// @ts-nocheck
import React from 'react';
import './utils/Config';
import {render} from 'react-dom';
import {AppQueryProvider} from './hooks/queryState';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import App from './components/App';
import '@fortawesome/fontawesome-free/css/all.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './utils/Config';

console.log("Starting");
render(
  <AppQueryProvider>
    <BrowserRouter>
      <Route path="/" component={App}/>
    </BrowserRouter>
  </AppQueryProvider>,
  document.getElementById('root')
);
