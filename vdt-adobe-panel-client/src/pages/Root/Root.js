import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { AuthProvider } from '@vidispine/vdt-react';

import SearchItem, { path as SearchItemPath } from '../SearchItem';
import Layout from './components/Layout';
import RootPath from './path';
import Login from '../Login';
import { LOGIN_EXPIRES_SECONDS, APP_BASENAME } from '../../const';

function Root() {
  const [loginError, setLoginError] = React.useState();
  const handleLoginError = ({ message }) => {
    setLoginError(message);
    setTimeout(() => setLoginError(), 5000);
  };
  return (
    <AuthProvider
      cookieOptions={{
        maxAge: LOGIN_EXPIRES_SECONDS,
        path: APP_BASENAME,
      }}
      onError={handleLoginError}
      LoginComponent={Login}
      LoginProps={{ error: loginError }}
    >
      <Layout>
        <Switch>
          <Route exact path={SearchItemPath()}>
            <SearchItem />
          </Route>
          <Redirect exact from={RootPath()} push to={SearchItemPath()} />
          <Redirect exact from="index.html" push to={SearchItemPath()} />
          <Route path="*">
            <Redirect exact push to={SearchItemPath()} />
          </Route>
        </Switch>
      </Layout>
    </AuthProvider>
  );
}

export default Root;
