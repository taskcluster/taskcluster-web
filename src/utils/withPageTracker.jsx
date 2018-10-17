import React, { Component } from 'react';
import ReactGA from 'react-ga';

export default WrappedComponent =>
  class WithPageTracker extends Component {
    currentPage = null;

    componentDidMount() {
      this.trackPage(window.location.pathname);
    }

    componentDidUpdate() {
      this.trackPage(window.location.pathname);
    }

    trackPage(page) {
      if (process.env.GA_TRACKING_ID && this.currentPage !== page) {
        this.currentPage = page;
        ReactGA.pageview(page);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
