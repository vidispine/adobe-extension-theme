import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';

import DarkTheme from './themes/DarkTheme';
import Root from './pages/Root';
import { ErrorBoundary } from './components';
import { APP_TITLE, APP_BASENAME } from './const';

document.title = APP_TITLE;

ReactDOM.render(
  <ErrorBoundary>
    <MuiThemeProvider theme={DarkTheme}>
      <CssBaseline>
        <Router basename={APP_BASENAME}>
          <Root />
        </Router>
      </CssBaseline>
    </MuiThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root'),
);
