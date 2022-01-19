import React from 'react';
import { LoginForm } from '@vidispine/vdt-materialui';
import { withStyles, Grid, Hidden } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import UrlField from './UrlField';

import { APP_TITLE, APP_LOGO } from '../../const';

const styles = (theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      height: '100vh',
    },
    '& .MuiFormHelperText-root': {
      height: 0,
      visibility: 'hidden',
    },
    '& .MuiFormHelperText-root.Mui-error': {
      height: 'auto',
      visibility: 'visible',
    },
  },
  gridLeft: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  gridRight: {
    height: 'inherit',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.background.login,
  },
  logo: {
    width: '25vw',
    backgroundColor: 'white',
  },
  logoContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(0.5),
  },
});

function Login({ classes, onLogin, error }) {
  return (
    <Grid className={classes.root} container direction="row" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={3} className={classes.gridLeft}>
        <Hidden smUp>
          <div className={classes.logoContainer}>
            <img src={APP_LOGO} alt={APP_TITLE} className={classes.logo} />
          </div>
        </Hidden>
        {error && (
          <Alert severity="error" className={classes.alert}>
            {error}
          </Alert>
        )}
        <LoginForm
          FormProps={{ styles }}
          onSubmit={onLogin}
          RememberMeFieldComponent={null}
          UrlFieldComponent={UrlField}
        />
      </Grid>
      <Hidden xsDown>
        <Grid item sm className={classes.gridRight}>
          <img src={APP_LOGO} alt={APP_TITLE} className={classes.logo} />
        </Grid>
      </Hidden>
    </Grid>
  );
}

export default withStyles(styles)(Login);
