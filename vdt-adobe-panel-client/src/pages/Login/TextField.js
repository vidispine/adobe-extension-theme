import React from 'react';

import MUITextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';

const TextField = ({
  input: { name, onChange, value, ...inputProps } = {},
  meta: { touched, error, submitError } = {},
  helperText = '\u00a0',
  classes,
  className,
  FormControlProps = {},
  ...props
}) => (
  <FormControl
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...FormControlProps}
  >
    <MUITextField
      name={name}
      helperText={touched && (error || submitError) ? error || submitError : helperText}
      error={(error || submitError) && touched}
      inputProps={inputProps}
      onChange={onChange}
      value={value}
      fullWidth
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </FormControl>
);

export default TextField;
