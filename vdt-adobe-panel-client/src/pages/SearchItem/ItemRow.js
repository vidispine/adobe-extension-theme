import React from 'react';
import moment from 'moment';
import { ItemListItem } from '@vidispine/vdt-materialui';
import { parseShapeType } from '@vidispine/vdt-js';
import { withStyles, Box, Typography } from '@material-ui/core';

import { Avatar, Action } from '../../components';
import { downloadItem, setSnackbar } from '../../cep';

const styles = ({ palette, spacing }) => ({
  root: {
    padding: spacing(1, 1, 1, 1),
    borderStyle: 'solid',
    borderWidth: 1,
    borderBottom: 0,
    backgroundColor: palette.color.gray.light,
    borderColor: palette.divider,
  },
});

const ItemRow = ({ classes, itemType = {} }) => {
  const { shape: [shape] = [], id: itemId } = itemType;
  const { fileSize } = parseShapeType(shape);
  const onClick = () =>
    downloadItem({
      itemId,
      // eslint-disable-next-line no-console
      onDownloadProgress: (downloadProgress) => console.log({ downloadProgress }),
    })
      .then(() => setSnackbar('Media Imported', 'info'))
      .catch((error) => setSnackbar(error.message, 'error'));
  return (
    <ItemListItem
      classes={classes}
      itemType={itemType}
      primary={({ title }) => (
        <Typography variant="subtitle1" noWrap>
          {title}
        </Typography>
      )}
      secondary={({ created }) => (
        <Box display="flex">
          <Typography noWrap variant="caption">
            {moment(created).format('l')}&nbsp;
          </Typography>
          <Typography noWrap variant="caption">
            -&nbsp;{fileSize}
          </Typography>
        </Box>
      )}
      AvatarComponent={Avatar}
      ActionComponent={() => <Action onClick={onClick} />}
      ListItemTextProps={{ disableTypography: true }}
    />
  );
};

export default withStyles(styles)(ItemRow);
