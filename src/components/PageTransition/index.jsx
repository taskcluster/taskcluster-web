import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import ArrowRightIcon from 'mdi-react/ArrowRightIcon';
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon';
import Button from '../Button';
import { THEME } from '../../utils/constants';

@withStyles(theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  smallText: {
    fontSize: '10px',
    color: fade(THEME.PRIMARY_TEXT_LIGHT, 0.5),
  },
  largeText: {
    color: fade(THEME.PRIMARY_TEXT_LIGHT, 0.8),
    fontSize: '14px',
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
            <Typography className={classes.smallText}>{variant}</Typography>
            <Typography className={classes.largeText}>
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
