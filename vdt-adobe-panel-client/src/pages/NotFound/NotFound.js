import React from 'react';
import { withStyles, Typography } from '@material-ui/core';

const styles = () => ({
  text: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%',
    alignItems: 'center',
  },
});

function NotFound({ classes }) {
  return <Typography className={classes.text}>Page does not exist</Typography>;
}

export default withStyles(styles)(NotFound);
