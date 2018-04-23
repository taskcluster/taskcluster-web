import { PureComponent, Fragment } from 'react';
import { node, object } from 'prop-types';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';

/**
 * A  button that displays a drawer when clicked.
 * The drawer opens above all other content until a selection is selected.
 */
export default class ButtonDrawer extends PureComponent {
  static propTypes = {
    /** The contents of the button. */
    children: node.isRequired,
    /** The contents of the drawer */
    content: node.isRequired,
    /** Properties applied to the Drawer element. */
    drawerProps: object,
  };

  static defaultProps = {
    drawerProps: null,
  };

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { open } = this.state;
    const { children, content, drawerProps, classes, ...props } = this.props;

    return (
      <Fragment>
        <Button onClick={this.handleToggle} {...props}>
          {children}
        </Button>
        <Drawer
          anchor="right"
          open={open}
          onClose={this.handleToggle}
          {...drawerProps}>
          {content}
        </Drawer>
      </Fragment>
    );
  }
}
