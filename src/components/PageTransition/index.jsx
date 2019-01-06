import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import ArrowRightIcon from 'mdi-react/ArrowRightIcon';
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';
import { oneOf } from 'prop-types';
import Button from '../Button';
import { THEME } from '../../utils/constants';

@withStyles(theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  rowFlex: {
    display: 'flex',
    '& svg': {
      transition: theme.transitions.create('fill'),
      fill: fade(THEME.PRIMARY_TEXT_LIGHT, 0.5),
    },
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  rightButtonText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    textAlign: 'left',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  leftButtonText: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    textAlign: 'right',
  },
}))
export default class PageTransition extends Component {
  static defaultProps = {
    variant: null,
  };

  static propTypes = {
    /** The variant to use. */
    variant: oneOf(['prev', 'next']),
  };

  render() {
    const { classes, variant } = this.props;

    return (
      <Button
        {...this.props}
        variant="contained"
        color="default"
        className={classes.button}>
        <div className={classes.rowFlex}>
          {variant === 'prev' && <ArrowLeftIcon className={classes.leftIcon} />}
          <div
            className={
              variant === 'prev'
                ? classes.leftButtonText
                : classes.rightButtonText
            }>
            <Typography variant="caption" color="inherit">
              {variant}
            </Typography>
            <Typography variant="button" color="primary">
              {this.props.children}
            </Typography>
          </div>
          {variant === 'next' && (
            <ArrowRightIcon className={classes.rightIcon} />
          )}
        </div>
      </Button>
    );
  }
}
