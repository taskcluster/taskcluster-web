import { Helmet } from 'react-helmet';
import React, { Component } from 'react';
import { lowerCase } from 'change-case';
import { taskGroupState } from '../../utils/prop-types';

export default class Favicon extends Component {
  static propTypes = {
    state: taskGroupState,
  };

  static defaultProps = {
    state: null,
  };

  render() {
    const { state } = this.props;

    return (
      <Helmet>
        {state ? (
          <link href={`/logo${lowerCase(state)}.png`} rel="shortcut icon" />
        ) : (
          <link href="/logo.png" rel="shortcut icon" />
        )}
      </Helmet>
    );
  }
}
