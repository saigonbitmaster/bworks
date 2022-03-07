import { connect } from 'react-redux';
import { DefaultLayout } from 'ra-loopback3';

const darkTheme = {
  palette: {
    type: 'dark', // Switching the dark mode on is a single property value change.
  },
};

const lightTheme = {
  palette: {
    secondary: {
      light: '#757de8',
      main: '#3f51b5',
      dark: '#002984',
      contrastText: '#fff',
    },
  },
};

export default connect(
  state => ({
    theme: state.theme === 'dark' ? darkTheme : lightTheme,
  }),
  {},
)(DefaultLayout);
