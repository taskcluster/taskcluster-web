import { Component } from 'react';
import MuiButton from '@material-ui/core/Button';
import { node } from 'prop-types';

/**
 * A Material UI button augmented with application specific props.
 */
export default class Button extends Component {
  static propTypes = {
    /** The content of the button. */
    children: node.isRequired,
  };

  render() {
    const { children, ...props } = this.props;

    return <MuiButton {...props}>{children}</MuiButton>;
  }
}
