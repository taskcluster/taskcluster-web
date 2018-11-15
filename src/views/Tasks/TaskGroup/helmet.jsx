import { Helmet } from 'react-helmet';
import React, { Component } from 'react';

export default class TestHelmet extends Component {
  render() {
    return (
      <Helmet>
        {this.props.status ? (
          <link href={`/logo${this.props.status}`} rel="shortcut icon" />
        ) : (
          <link href="/logo.png" rel="shortcut icon" />
        )}
      </Helmet>
    );
  }
}
