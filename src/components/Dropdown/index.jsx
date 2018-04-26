import { Component } from 'react';
import { func, node, string } from 'prop-types';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';

@withStyles(theme => ({
  root: {
    minWidth: 200,
    marginBottom: theme.spacing.double,
  },
}))
/**
 * A dropdown menu.
 */
export default class Dropdown extends Component {
  static propTypes = {
    /** Callback function fired when a menu item is selected. */
    onChange: func.isRequired,
    /** The input value. */
    value: string.isRequired,
    /** The option elements to populate the select with. */
    children: node.isRequired,
    /** The label content */
    label: string.isRequired,
  };

  render() {
    const { children, classes, label, value, onChange, ...props } = this.props;

    return (
      <TextField
        className={classes.root}
        select
        label={label}
        value={value}
        onChange={onChange}
        {...props}>
        {children}
      </TextField>
    );
  }
}
