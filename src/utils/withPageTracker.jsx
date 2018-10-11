import React, { Component } from 'react';
import ReactGA from 'react-ga';

let currentPage = null;

export default WrappedComponent =>
  class WithPageTracker extends Component {
    trackPage(page) {
      if (process.env.GA_TRACKING_ID && currentPage !== page) {
        currentPage = page;
        ReactGA.pageview(page);
      }
    }

    componentDidMount() {
      this.trackPage(window.location.pathname);
    }

    componentDidUpdate() {
      this.trackPage(window.location.pathname);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
