import React from 'react';

import { Field } from 'react-final-form';
import clsx from 'clsx';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import TextField from './TextField';

const styles = () => ({
  root: {
    width: '100%',
  },
});

const isUrl = (value = '', helperText = 'Not a URL') => {
  const expression = /https?:\/\/[-a-zA-Z0-9@:%._+~#=]{2,256}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
  const regex = new RegExp(expression);
  const matches = value.match(regex);
  return matches ? undefined : helperText;
};

const UrlField = ({
  name = 'serverUrl',
  label = 'Vidispine API Server',
  FieldProps = {},
  classes,
  className,
  FormControlProps = {},
  ...props
}) => {
  return (
    <FormControl
      className={clsx(classes.root, 'VdtTextField-root', className)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...FormControlProps}
    >
      <Field
        name={name}
        component={TextField}
        type="text"
        label={label}
        validate={(value) => isUrl(value)}
        fullWidth
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...FieldProps}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </FormControl>
  );
};

export default withStyles(styles, { name: 'VdtTextField' })(UrlField);
