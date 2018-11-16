import { Helmet } from 'react-helmet';
import React, { Component } from 'react';

export default class Favicon extends Component {
  render() {
    return (
      <Helmet>
        {this.props.status ? (
          <link href={`/logo${this.props.status}.png`} rel="shortcut icon" />
        ) : (
          <link href="/logo.png" rel="shortcut icon" />
        )}
      </Helmet>
    );
  }
}
