import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { graphql } from 'react-apollo/index';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import LinkIcon from 'mdi-react/LinkIcon';
import Dashboard from '../../../components/Dashboard';
import StatusLabel from '../../../components/StatusLabel';
import Search from '../../../components/Search';
import getTaskIdHistory from '../../../utils/getTaskIdHistory';
import recentTasksQuery from './recentTask.graphql';

@hot(module)
@graphql(recentTasksQuery, {
  options: {
    variables: {
      taskIds: getTaskIdHistory,
    },
  },
})
@withStyles(theme => ({
  infoText: {
    marginBottom: theme.spacing.unit,
  },
  listItemButton: {
    ...theme.mixins.listItemButton,
  },
}))
export default class NoTask extends Component {
  state = {
    taskSearch: '',
  };

  handleTaskSearchChange = e => {
    this.setState({ taskSearch: e.target.value || '' });
  };

  handleTaskSearchSubmit = e => {
    e.preventDefault();
    this.props.history.push(`/tasks/${this.state.taskSearch}`);
  };

  render() {
    const {
      classes,
      data: { loading, error, tasks },
    } = this.props;
    const { taskSearch } = this.state;

    return (
      <Dashboard
        search={
          <Search
            value={taskSearch}
            onChange={this.handleTaskSearchChange}
            onSubmit={this.handleTaskSearchSubmit}
          />
        }>
        {loading && <Spinner />}
        {!loading && (
          <Fragment>
            <Typography className={classes.infoText}>
              Enter a task ID in the search box
            </Typography>
            {error && <ErrorPanel error={error} />}
            {tasks &&
              tasks.length && (
                <Fragment>
                  <List
                    dense
                    subheader={
                      <ListSubheader component="div">
                        Recent Tasks
                      </ListSubheader>
                    }>
                    {tasks.map(task => (
                      <ListItem
                        button
                        className={classes.listItemButton}
                        component={Link}
                        to={`/tasks/${task.taskId}`}
                        key={task.taskId}>
                        <StatusLabel state={task.status.state} />
                        <ListItemText primary={task.metadata.name} />
                        <LinkIcon />
                      </ListItem>
                    ))}
                  </List>
                </Fragment>
              )}
          </Fragment>
        )}
      </Dashboard>
    );
  }
}
