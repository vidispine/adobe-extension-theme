import React from 'react';
import { withStyles, Toolbar, AppBar } from '@material-ui/core';
import { UserAvatarButton } from '@vidispine/vdt-materialui';
import { useAuthContext } from '@vidispine/vdt-react';

import { AppTitle } from '../../../components';

const styles = (theme) => ({
  toolbar: {
    paddingRight: theme.spacing(2), // keep right padding when drawer closed
    paddingLeft: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
});

function Header({ classes }) {
  const { userName, serverUrl, onLogout } = useAuthContext();
  return (
    <AppBar color="default" position="absolute" className={classes.appBar} elevation={0}>
      <Toolbar className={classes.toolbar}>
        <AppTitle subheader={serverUrl} />
        <UserAvatarButton userName={userName} onLogout={onLogout} />
      </Toolbar>
    </AppBar>
  );
}

export default withStyles(styles)(Header);
