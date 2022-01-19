/* eslint-disable no-unused-vars */
import React from 'react';
import { withStyles, Avatar } from '@material-ui/core';
import { parseMetadataType } from '@vidispine/vdt-js';
import {
  MediaCardAvatar,
  MediaCardThumbnail,
  MediaCardDurationLabel,
} from '@vidispine/vdt-materialui';

const styles = ({ palette, spacing }) => ({
  root: {
    backgroundColor: palette.background.default,
    marginRight: spacing(1),
    '& .row-thumbnail': {},
  },
});

const AvatarComponent = ({ classes, ...innerProps }) => {
  const { itemType = {} } = innerProps;
  const { thumbnails = {}, metadata } = itemType;
  const { durationSeconds } = parseMetadataType(metadata, { flat: true, arrayOnSingle: false });
  const { uri: [src] = [] } = thumbnails;
  // eslint-disable-next-line react/jsx-props-no-spreading
  if (!src) return <MediaCardAvatar classes={classes} innerProps={innerProps} />;
  return (
    <MediaCardThumbnail
      scrubOnHover={false}
      classes={classes}
      innerProps={innerProps}
      width={80}
      height={50}
      labelRightBottom={durationSeconds}
      LabelComponentRightBottom={MediaCardDurationLabel}
    />
  );
  // return <Avatar src={src} variant="square" />;
};

export default withStyles(styles)(AvatarComponent);
