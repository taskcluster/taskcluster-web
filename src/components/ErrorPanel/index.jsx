import React, { Component } from 'react';
import { oneOfType, string, object } from 'prop-types';
import MuiErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';

export default class ErrorPanel extends Component {
  static propTypes = {
    /** Error to display. */
    error: oneOfType([string, object]),
  };

  static defaultProps = {
    error: null,
  };

  state = {
    error: null,
    // eslint-disable-next-line react/no-unused-state
    previousError: null,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.error !== state.previousError) {
      return {
        error: props.error,
        previousError: props.error,
      };
    }

    return null;
  }

  handleErrorClose = () => {
    const { onClose } = this.props;

    this.setState({ error: null });

    if (onClose) {
      onClose();
    }
  };

  render() {
    const { error: _, ...props } = this.props;
    const { error } = this.state;
    const errorMessage =
      typeof error === 'string' || error === null
        ? error
        : error.graphQLErrors[0].message;
    return (
      error && (
        <MuiErrorPanel
          error={errorMessage}
          onClose={this.handleErrorClose}
          {...props}
        />
      )
    );
  }
}
