import { createMuiTheme } from '@material-ui/core/styles';
import { fade, lighten } from '@material-ui/core/styles/colorManipulator';
import transitions from '@material-ui/core/styles/transitions';
import red from '@material-ui/core/colors/red';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

const Roboto300 = { fontFamily: 'Roboto300, sans-serif' };
const Roboto400 = { fontFamily: 'Roboto400, sans-serif' };
const Roboto500 = { fontFamily: 'Roboto500, sans-serif' };
const TEN_PERCENT_WHITE = fade('#fff', 0.1);
const TEN_PERCENT_BLACK = fade('#000', 0.1);
const DARK_THEME_BACKGROUND = '#12202c';
const PRIMARY = '#1b2a39';
const SECONDARY = '#4177a5';
const success = {
  main: green[500],
  dark: green[800],
};
const warning = {
  main: amber[500],
  dark: amber[700],
  light: amber[200],
  contrastText: 'rgba(0, 0, 0, 0.87)',
};
const error = {
  main: red[500],
  dark: red[700],
  light: red[300],
};
const createTheme = isDarkTheme => ({
  palette: {
    type: isDarkTheme ? 'dark' : 'light',
    background: isDarkTheme ? DARK_THEME_BACKGROUND : 'white',
    primary: {
      main: PRIMARY,
    },
    secondary: {
      main: SECONDARY,
    },
    error: {
      ...red,
      ...error,
    },
    success: {
      ...green,
      ...success,
    },
    warning: {
      ...amber,
      ...warning,
    },
    info: {
      ...blue,
    },
    text: {
      primary: isDarkTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      secondary: isDarkTheme
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0, 0, 0, 0.7)',
      disabled: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      hint: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      icon: isDarkTheme ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
      active: isDarkTheme ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
      inactive: isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)',
    },
  },
  typography: {
    ...Roboto400,
    display4: Roboto300,
    display3: Roboto400,
    display2: Roboto400,
    display1: Roboto400,
    headline: Roboto400,
    title: Roboto500,
    subheading: Roboto400,
    body2: Roboto500,
    body1: Roboto400,
    caption: Roboto400,
    button: Roboto500,
  },
  spacing: {
    unit: 8,
    double: 16,
    triple: 24,
    quad: 32,
  },
  drawerWidth: 240,
  mixins: {
    highlight: {
      fontFamily: 'Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace',
      backgroundColor: TEN_PERCENT_WHITE,
      border: `1px solid ${TEN_PERCENT_WHITE}`,
      borderRadius: 2,
      paddingLeft: 4,
      paddingRight: 4,
    },
    listItemButton: {
      '& svg': {
        transition: transitions.create('fill'),
        fill: isDarkTheme ? lighten(PRIMARY, 0.2) : 'rgba(0, 0, 0, 0.3)',
      },
      '&:hover svg': {
        fill: isDarkTheme ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
      },
    },
    fab: {
      position: 'fixed',
      bottom: 16,
      right: 24,
      '& .mdi-icon': {
        fill: 'white',
      },
    },
    successIcon: {
      backgroundColor: success.main,
      '&:hover': {
        backgroundColor: success.dark,
      },
      '& svg': {
        backgroundColor: 'transparent',
      },
    },
    warningIcon: {
      backgroundColor: warning.main,
      '&:hover': {
        backgroundColor: warning.dark,
      },
      '& svg': {
        backgroundColor: 'transparent',
      },
    },
    errorIcon: {
      backgroundColor: error.main,
      '&:hover': {
        backgroundColor: error.dark,
      },
      '& svg': {
        backgroundColor: 'transparent',
      },
    },
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: isDarkTheme ? PRIMARY : 'white',
      },
    },
    MuiButton: {
      sizeSmall: {
        minWidth: 36,
      },
    },
    MuiCircularProgress: {
      colorPrimary: {
        color: isDarkTheme ? 'white' : PRIMARY,
      },
    },
    MuiMobileStepper: {
      dotActive: {
        backgroundColor: isDarkTheme ? 'white' : '#000',
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: `1px solid ${
          isDarkTheme ? TEN_PERCENT_WHITE : TEN_PERCENT_BLACK
        }`,
        whiteSpace: 'nowrap',
      },
    },
    MuiPickersYear: {
      root: {
        '&:focus': {
          color: isDarkTheme ? 'white' : '#000',
        },
      },
      selected: {
        color: isDarkTheme ? 'white' : '#000',
      },
    },
    MuiPickersDay: {
      selected: {
        backgroundColor: SECONDARY,
      },
      current: {
        color: isDarkTheme ? 'white' : '#000',
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: isDarkTheme ? 'white' : '#000',
        '&:hover': {
          backgroundColor: isDarkTheme ? TEN_PERCENT_WHITE : TEN_PERCENT_BLACK,
        },
      },
    },
  },
});
const theme = createMuiTheme(createTheme(true));

export default {
  lightTheme: createMuiTheme(createTheme(false)),
  darkTheme: theme,
  styleguide: {
    StyleGuide: {
      root: {
        overflowY: 'scroll',
        minHeight: '100vh',
        backgroundColor: DARK_THEME_BACKGROUND,
      },
    },
    fontFamily: {
      base: theme.typography.fontFamily,
    },
    fontSize: {
      base: theme.typography.fontSize - 1,
      text: theme.typography.fontSize,
      small: theme.typography.fontSize - 2,
    },
    color: {
      base: theme.palette.text.primary,
      link: theme.palette.text.primary,
      linkHover: theme.palette.text.primary,
      border: theme.palette.divider,
      baseBackground: DARK_THEME_BACKGROUND,
      sidebarBackground: theme.palette.primary.main,
      codeBackground: theme.palette.primary.main,
    },
    sidebarWidth: theme.drawerWidth,
    maxWidth: '100vw',
  },
};
