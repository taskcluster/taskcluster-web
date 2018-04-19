import { PureComponent } from 'react';
import { node } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';

@withStyles(theme => ({
  root: {
    display: 'inline-block',
    verticalAlign: 'middle',
  },
  listItem: {
    marginLeft: -theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  listItemButton: {
    '& svg': {
      transition: theme.transitions.create('fill'),
      fill: theme.palette.primary.light,
    },
    '&:hover svg': {
      fill: theme.palette.common.white,
    },
  },
}))
/**
 * A styled ListItem to be used when placed immediately after a TableCell.
 */
export default class TableCellListItem extends PureComponent {
  static propTypes = {
    /** The table cell contents. */
    children: node.isRequired,
  };

  render() {
    const { classes, children, ...props } = this.props;

    return (
      <List classes={{ root: classes.root }}>
        <ListItem
          classes={{ gutters: classes.listItem }}
          className={classes.listItemButton}
          {...props}>
          {children}
        </ListItem>
      </List>
    );
  }
}
