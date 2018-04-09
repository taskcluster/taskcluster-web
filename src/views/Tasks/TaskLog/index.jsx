import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import ArrowRightIcon from 'mdi-react/ArrowRightIcon';
import Dashboard from '../../../components/Dashboard';
import Log from '../../../components/Log';
import GoToLineButton from '../../../components/Log/GoToLineButton';

@hot(module)
@withStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.double,
    right: theme.spacing.triple,
  },
  miniFab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 11,
    right: theme.spacing.quad,
  },
}))
export default class TaskLog extends Component {
  state = {
    lineNumber: null,
  };

  handleLineNumberChange = lineNumber => {
    this.setState({ lineNumber });
  };

  render() {
    const { classes, user, onSignIn, onSignOut, match } = this.props;
    const { lineNumber } = this.state;
    const url = decodeURIComponent(match.params.logUrl);

    return (
      <Dashboard
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}
        disablePadding>
        <Log
          url={url}
          stream={false}
          lineNumber={lineNumber}
          actions={
            <Fragment>
              <GoToLineButton
                className={classes.miniFab}
                onLineNumberChange={this.handleLineNumberChange}
              />
              <Tooltip placement="left" title="View task">
                <Button
                  component={Link}
                  to={`/tasks/${match.params.taskId}/runs/${
                    match.params.runId
                  }`}
                  variant="fab"
                  className={classes.fab}
                  color="secondary">
                  <ArrowRightIcon />
                </Button>
              </Tooltip>
            </Fragment>
          }
        />
      </Dashboard>
    );
  }
}
