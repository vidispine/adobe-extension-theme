import { createTheme } from '@material-ui/core/styles';

import 'typeface-roboto';
import '@vidispine/vdt-materialui/dist/index.css';

const theme = createTheme({
  typography: {
    useNextVariants: true,
    htmlFontSize: 22,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  mixins: { toolbar: { minHeight: 48 } },
  palette: {
    type: 'dark',
    primary: { main: 'rgb(33, 33, 33)' },
    background: {
      login: 'linear-gradient(-45deg,#b0c800,#0068a9 0,#0068a9 33%,#002749 100%,#b0c800 0)',
      default: 'rgb(33, 33, 33)',
      paper: 'rgb(33, 33, 33)',
    },
    color: {
      gray: {
        light: 'rgb(29,29,29)',
        normal: 'rgb(33,33,33)',
        scrollbar: 'rgb(49,49,49)',
        strong: 'rgb(66,66,66)',
        dark: 'rgb(138,138,138)',
      },
    },
  },
  overrides: {
    VdtUserAvatarButton: {
      avatar: {
        backgroundColor: '#4A6A7D',
        fontSize: '0.75rem',
        height: 24,
        width: 24,
      },
    },
    MuiCssBaseline: {
      '@global': {
        '*::-webkit-scrollbar': {
          width: '0.75rem',
        },
        '*::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgb(49,49,49)',
        },
      },
    },
  },
  props: {
    VdtUserAvatarButton: {
      locale: { options: undefined },
      userName: '',
    },
  },
});

export default theme;
