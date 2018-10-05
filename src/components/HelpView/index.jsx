import { Fragment, PureComponent } from 'react';
import { node, string } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

@withStyles(theme => ({
  divider: {
    margin: `${theme.spacing.unit}px 0`,
  },
}))
export default class HelpView extends PureComponent {
  static propTypes = {
    // TODO: Add comments
    description: string,
    children: node,
  };

  render() {
    const { classes, children, description } = this.props;

    return (
      <Fragment>
        {description && (
          <Fragment>
            <Typography variant="subheading">Description</Typography>
            <Typography paragraph>{description}</Typography>
          </Fragment>
        )}
        {children && (
          <Fragment>
            <Divider className={classes.divider} />
            {children}
          </Fragment>
        )}
      </Fragment>
    );
  }
}
