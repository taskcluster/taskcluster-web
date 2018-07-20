import { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../theme';

/** A HOC that provides the ability toggle themes  */
const withThemeToggler = ComposedComponent =>
  class ThemeToggler extends Component {
    state = {
      theme: theme.lightTheme,
    };

    handleThemeToggle = () => {
      this.setState({
        theme:
          this.state.theme.palette.type === 'dark'
            ? theme.lightTheme
            : theme.darkTheme,
      });
    };

    render() {
      return (
        <MuiThemeProvider theme={this.state.theme}>
          <ComposedComponent
            {...this.props}
            onThemeToggle={this.handleThemeToggle}
            theme={this.state.theme}
          />
        </MuiThemeProvider>
      );
    }
  };

export default withThemeToggler;
