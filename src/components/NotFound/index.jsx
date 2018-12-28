import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Emoticon from './Emoticon';
import { DOCS_PATH_PREFIX } from '../../utils/constants';

@withStyles(
  theme => ({
    root: {
      textAlign: 'center',
    },
    emoticon: {
      position: 'fixed',
      height: '50%',
      width: '100%',
      right: 0,
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${theme.drawerWidth}px)`,
      },
    },
    docsEmoticonWidth: {
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${theme.docsDrawerWidth}px)`,
      },
    },
    typography: {
      fontFamily: 'Roboto500',
    },
    icon: {
      fill: theme.palette.primary.main,
    },
  }),
  { withTheme: true }
)
export default class NotFound extends Component {
  render() {
    const { classes, theme } = this.props;
    const isDocs = window.location.pathname.startsWith(DOCS_PATH_PREFIX);

    return (
      <div className={classes.root}>
        <Typography variant="h1" className={classes.typography}>
          404
        </Typography>
        <Typography variant="h4" className={classes.typography}>
          We couldn&apos;t find a page at that address.
          <br />
          <br />
          <br />
        </Typography>
        <Emoticon
          className={classNames(classes.emoticon, {
            [classes.docsEmoticonWidth]: isDocs,
          })}
          fill={theme.palette.text.primary}
        />
      </div>
    );
  }
}
