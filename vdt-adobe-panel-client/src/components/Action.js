import React from 'react';
import { withStyles, IconButton } from '@material-ui/core';
import { Forward as ForwardIcon } from '@material-ui/icons';

const styles = {};

const ActionButton = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <ForwardIcon />
  </IconButton>
);

export default withStyles(styles)(ActionButton);
