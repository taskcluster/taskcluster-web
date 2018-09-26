import { Component } from 'react';
import { bool, string } from 'prop-types';
import { VncDisplay as Vnc } from 'react-vnc-display';

export default class VncDisplay extends Component {
  static propTypes = {
    url: string.isRequired,
    shared: bool,
    viewOnly: bool,
  };

  static defaultProps = {
    shared: false,
    viewOnly: false,
  };

  render() {
    return (
      <Vnc
        url={this.props.url}
        view_only={this.props.viewOnly}
        shared={this.props.shared}
      />
    );
  }
}
