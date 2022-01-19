import React from 'react';
import { withStyles, Container } from '@material-ui/core';

import Header from './Header';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: {
    ...theme.mixins.toolbar,
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flexGrow: 1,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
});

function Layout({ classes, children }) {
  return (
    <div className={classes.root}>
      <Header />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
}

export default withStyles(styles)(Layout);
