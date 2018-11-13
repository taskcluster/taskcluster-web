import { Helmet } from 'react-helmet';
import React, { Component } from 'react';

export default class TestHelmet extends Component {
  render() {
    return (
      <Helmet>
        {/* <title>Testing</title> */}
        <link href="/testLogo.png" rel="shortcut icon" />
      </Helmet>
    );
  }
}
