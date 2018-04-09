import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import ArrowRightIcon from 'mdi-react/ArrowRightIcon';
import Dashboard from '../../../components/Dashboard';
import Log from '../../../components/Log';

@hot(module)
@withStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.double,
    right: theme.spacing.triple,
  },
  goToLineButton: {
    position: 'absolute',
    bottom: theme.spacing.unit * 11,
    right: theme.spacing.quad,
  },
  followButton: {
    position: 'absolute',
    bottom: theme.spacing.unit * 18,
    right: theme.spacing.quad,
  },
}))
export default class LiveTaskLog extends Component {
  render() {
    const { classes, user, onSignIn, onSignOut, match } = this.props;
    const url = decodeURIComponent(match.params.logUrl);

    return (
      <Dashboard
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        disablePadding>
        <Log
          url={url}
          stream
          GoToLineButtonProps={{ className: classes.goToLineButton }}
          FollowLogButtonProps={{ className: classes.followButton }}
          actions={
            <Tooltip placement="left" title="View task">
              <Button
                component={Link}
                to={`/tasks/${match.params.taskId}/runs/${match.params.runId}`}
                variant="fab"
                className={classes.fab}
                color="secondary">
                <ArrowRightIcon />
              </Button>
            </Tooltip>
          }
        />
      </Dashboard>
    );
  }
}
