import React from 'react';
import moment from 'moment';
import { parseShapeType } from '@vidispine/vdt-js';
import { MediaCard } from '@vidispine/vdt-materialui';
import { withStyles, Box, Divider, Typography } from '@material-ui/core';
import { downloadItem, setSnackbar } from '../../cep';

const styles = ({ palette }) => ({
  root: {
    cursor: 'pointer',
    borderWidth: 1,
    borderColor: palette.divider,
    width: '100%',
    '& .card-thumbnail': {
      backgroundColor: palette.background.default,
    },
    '& .card-header > div': {
      overflow: 'hidden',
    },
  },
});

const Content = ({ subheader, fileSize }) => (
  <>
    <Divider />
    <Box py={0.5} px={1} display="flex" flexDirection="column">
      <Typography noWrap style={{ flexGrow: 1 }} variant="caption">
        {moment(subheader).format('L')}
      </Typography>
      <Typography noWrap style={{ flexGrow: 1 }} variant="caption">
        {fileSize}
      </Typography>
    </Box>
  </>
);

const ItemCard = ({ title, subheader, ThumbnailProps, itemType, classes }) => {
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
    <MediaCard
      title={title}
      itemType={itemType}
      classes={classes}
      CardProps={{ onClick }}
      ContentProps={{ subheader, fileSize }}
      ActionsComponent={null}
      ContentComponent={Content}
      MenuComponent={null}
      HeaderProps={{
        className: 'card-header',
        titleTypographyProps: { variant: 'subtitle1', noWrap: true },
      }}
      AvatarComponent={null}
      ThumbnailProps={{
        height: 80,
        scrubOnHover: false,
        className: 'card-thumbnail',
        ...ThumbnailProps,
      }}
    />
  );
};

export default withStyles(styles)(ItemCard);
