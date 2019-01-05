import React, { Component } from 'react';
import MatButton from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

@withStyles(theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
}))
export default class PageTransition extends Component {
  render() {
    const { classes } = this.props;

    return (
      <MatButton
        {...this.props}
        variant="contained"
        color="default"
        className={classes.button}>
        {this.props.children}
      </MatButton>
    );
  }
}
