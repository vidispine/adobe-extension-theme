import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core';
import { useAuthContext } from '@vidispine/vdt-react';

const styles = (theme) => ({
  paper: {
    maxHeight: theme.spacing(1),
    lineHeight: '5ch',
    width: '20ch',
    overflow: 'hidden',
  },
});

function LongMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { onLogout } = useAuthContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
        <MenuItem onClick={onLogout}>Sign Out</MenuItem>
      </Menu>
    </div>
  );
}
export default withStyles(styles)(LongMenu);
