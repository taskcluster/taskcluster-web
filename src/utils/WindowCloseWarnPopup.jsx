import { Component } from 'react';

class WindowCloseWarnPopup extends Component {
  componentDidMount = () => {
    window.addEventListener('beforeunload', this.keepOnPage);
  };

  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.keepOnPage);
  };

  keepOnPage = event => {
    const message = 'Warning! Unsaved changes';

    // eslint-disable-next-line no-param-reassign
    event.returnValue = message;

    return message;
  };

  render() {
    return null;
  }
}

export default WindowCloseWarnPopup;
