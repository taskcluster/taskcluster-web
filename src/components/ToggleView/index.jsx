import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import { bool, node, object } from 'prop-types';
import Button from '../Button';

@withStyles(theme => ({
  infoButton: {
    backgroundColor: theme.palette.info[700],
    marginBottom: '4px',
  },
}))
export default class ToggleView extends Component {
  static defaultProps = {
    defaultExpanded: false,
    panel: null,
    btnStyle: null,
  };

  state = {
    expanded: null,
  };

  static propTypes = {
    /** indicate whether the panel will be shown by default */
    defaultExpanded: bool,
    /** the panel element to be shown */
    panel: node.isRequired,
    /** style of the toggle button to override default styles */
    btnStyle: object,
  };

  static getDerivedStateFromProps(props, state) {
    if (state.expanded === null) {
      return {
        expanded: props.defaultExpanded,
      };
    }
  }

  handleClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { btnStyle, panel, classes, ...props } = this.props;
    const { expanded } = this.state;

    return (
      <Fragment>
        <Button
          variant="contained"
          className={classNames(classes.infoButton, btnStyle)}
          onClick={this.handleClick}
          {...props}>
          <Typography>{(expanded && 'Hide') || 'Show'}</Typography>
        </Button>
        {expanded && panel}
      </Fragment>
    );
  }
}
