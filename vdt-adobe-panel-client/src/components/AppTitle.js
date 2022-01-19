import React from 'react';
import { Typography, Grid, Box, Avatar, withStyles, Tooltip } from '@material-ui/core';
import { APP_TITLE, HEADER_LOGO } from '../const';

const styles = (theme) => ({
  root: {
    height: `calc(${theme.mixins.toolbar.minHeight}px - ${theme.spacing(3)}px)`,
    width: `calc(${theme.mixins.toolbar.minHeight}px - ${theme.spacing(3)}px)`,
    marginRight: theme.spacing(3),
  },
  headerTitle: {
    color: theme.palette.color.gray.strong,
    '@media (max-width:260px)': {
      // eslint-disable-line no-useless-computed-key
      display: 'none',
    },
  },
});

const AppTitle = ({ classes, subheader }) => (
  <Grid container alignItems="center">
    <Tooltip title={subheader} placement="right-start">
      <Avatar classes={classes} variant="square" height={20} src={HEADER_LOGO} alt={APP_TITLE} />
    </Tooltip>
    <Box>
      <Tooltip title={subheader} placement="right-start">
        <Typography variant="h6" className={classes.headerTitle}>
          {APP_TITLE}
        </Typography>
      </Tooltip>
    </Box>
  </Grid>
);

export default withStyles(styles)(AppTitle);
