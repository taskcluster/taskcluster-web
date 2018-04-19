import { Component } from 'react';
import { func, node, string } from 'prop-types';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
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
    /** The contents of the InputLabel */
    inputLabel: string.isRequired,
  };

  render() {
    const {
      children,
      classes,
      inputLabel,
      value,
      onChange,
      ...props
    } = this.props;

    return (
      <FormControl className={classes.root} {...props}>
        <InputLabel htmlFor={`select-${inputLabel}`}>{inputLabel}</InputLabel>
        <Select
          onChange={onChange}
          value={value}
          inputProps={{
            id: `select-${inputLabel}`,
          }}>
          {children}
        </Select>
      </FormControl>
    );
  }
}
