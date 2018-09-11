import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { graphql, withApollo } from 'react-apollo';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Markdown from '@mozilla-frontend-infra/components/Markdown';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import dotProp from 'dot-prop-immutable';
import jsonSchemaDefaults from 'json-schema-defaults';
import { safeDump } from 'js-yaml';
import HammerIcon from 'mdi-react/HammerIcon';
import Dashboard from '../../../components/Dashboard';
import TaskDetailsCard from '../../../components/TaskDetailsCard';
import TaskRunsCard from '../../../components/TaskRunsCard';
import Search from '../../../components/Search';
import SpeedDial from '../../../components/SpeedDial';
import SpeedDialAction from '../../../components/SpeedDialAction';
import DialogAction from '../../../components/DialogAction';
import TaskActionForm from '../../../components/TaskActionForm';
import {
  ACTIONS_JSON_KNOWN_KINDS,
  ARTIFACTS_PAGE_SIZE,
  VALID_TASK,
} from '../../../utils/constants';
import taskQuery from './task.graphql';
import pageArtifactsQuery from './pageArtifacts.graphql';
import db from '../../../utils/db';
import submitTaskAction from '../submitTaskAction';

const updateTaskIdHistory = id => {
  if (!VALID_TASK.test(id)) {
    return;
  }

  db.taskIdsHistory.put({ taskId: id });
};

const taskInContext = (tagSetList, taskTags) =>
  tagSetList.some(tagSet =>
    Object.keys(tagSet).every(
      tag => taskTags[tag] && taskTags[tag] === tagSet[tag]
    )
  );

@hot(module)
@withApollo
@withStyles(theme => ({
  title: {
    marginBottom: theme.spacing.unit,
  },
  divider: {
    margin: `${theme.spacing.triple}px 0`,
  },
  owner: {
    marginTop: theme.spacing.unit,
  },
}))
@graphql(taskQuery, {
  skip: props => !props.match.params.taskId,
  options: props => ({
    errorPolicy: 'all',
    variables: {
      taskId: props.match.params.taskId,
      artifactsConnection: {
        limit: ARTIFACTS_PAGE_SIZE,
      },
      taskActionsFilter: {
        kind: {
          $in: ACTIONS_JSON_KNOWN_KINDS,
        },
        context: {
          $not: {
            $size: 0,
          },
        },
      },
    },
  }),
})
export default class ViewTask extends Component {
  state = {
    taskSearch: '',
    // eslint-disable-next-line react/no-unused-state
    previousTaskId: null,
    taskActions: [],
    actionInputs: {},
    actionData: {},
    selectedAction: null,
    dialogOpen: false,
    actionLoading: false,
  };

  static getDerivedStateFromProps(props, state) {
    const taskId = props.match.params.taskId || '';
    const {
      data: { task },
    } = props;
    const taskActions = [];
    const actionInputs = state.actionInputs || {};
    const actionData = state.actionData || {};

    if (taskId !== state.previousTaskId && task) {
      const { taskActions: actions } = task;

      updateTaskIdHistory(taskId);

      actions.actions.forEach(action => {
        const schema = action.schema || {};

        if (task && task.tags && taskInContext(action.context, task.tags)) {
          taskActions.push(action);
        } else {
          return;
        }

        actionInputs[action.name] = safeDump(jsonSchemaDefaults(schema) || {});
        actionData[action.name] = {
          action,
        };
      });

      return {
        taskActions,
        actionInputs,
        actionData,
        taskSearch: taskId,
        previousTaskId: taskId,
      };
    }

    return null;
  }

  handleActionClick = ({ target: { name } }) => {
    const { action } = this.state.actionData[name];

    this.setState({ dialogOpen: true, selectedAction: action });
  };

  handleActionDialogClose = () => {
    this.setState({ dialogOpen: false, selectedAction: null });
  };

  handleActionTaskComplete = action => taskId => {
    switch (action.name) {
      case 'create-interactive':
        this.props.history.push(`/tasks/${taskId}/connect`);
        break;
      default:
        this.props.history.push(`/tasks/${taskId}`);
    }
  };

  handleActionTaskSubmit = ({ name }) => async () => {
    this.setState({ actionLoading: true });

    const {
      client,
      data: { task },
    } = this.props;
    const { actionInputs, actionData } = this.state;
    const form = actionInputs[name];
    const { action } = actionData[name];
    const taskId = await submitTaskAction({
      task,
      taskActions: task.taskActions,
      form,
      action,
      apolloClient: client,
    });

    this.setState({
      actionLoading: false,
      dialogOpen: false,
      selectedAction: null,
    });

    return taskId;
  };

  handleTaskActionError = () => {
    this.setState({ actionLoading: false });
  };

  handleTaskSearchChange = e => {
    this.setState({ taskSearch: e.target.value || '' });
  };

  handleTaskSearchSubmit = e => {
    e.preventDefault();

    const { taskSearch } = this.state;

    if (this.props.match.params.taskId !== taskSearch) {
      this.props.history.push(`/tasks/${this.state.taskSearch}`);
    }
  };

  handleFormChange = (value, name) =>
    this.setState({
      actionInputs: {
        ...this.state.actionInputs,
        [name]: value,
      },
    });

  handleArtifactsPageChange = ({ cursor, previousCursor }) => {
    const {
      match,
      data: { task, fetchMore },
    } = this.props;
    const runId = match.params.runId || 0;

    return fetchMore({
      query: pageArtifactsQuery,
      variables: {
        runId,
        taskId: task.taskId,
        connection: {
          limit: ARTIFACTS_PAGE_SIZE,
          cursor,
          previousCursor,
        },
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        const { edges, pageInfo } = fetchMoreResult.artifacts;

        if (!edges.length) {
          return previousResult;
        }

        return dotProp.set(
          previousResult,
          `task.status.runs.${runId}.artifacts`,
          artifacts =>
            dotProp.set(
              dotProp.set(artifacts, 'edges', edges),
              'pageInfo',
              pageInfo
            )
        );
      },
    });
  };

  render() {
    const {
      classes,
      data: { loading, error, task, dependentTasks },
      match,
    } = this.props;
    const {
      taskActions,
      taskSearch,
      selectedAction,
      dialogOpen,
      actionInputs,
      actionLoading,
    } = this.state;

    return (
      <Dashboard
        search={
          <Search
            value={taskSearch}
            onChange={this.handleTaskSearchChange}
            onSubmit={this.handleTaskSearchSubmit}
          />
        }>
        {loading && <Spinner loading />}
        {error &&
          error.graphQLErrors && <ErrorPanel error={error} warning={!!task} />}
        {task && (
          <Fragment>
            <Typography variant="headline" className={classes.title}>
              {task.metadata.name}
            </Typography>
            <Typography variant="subheading">
              <Markdown>{task.metadata.description}</Markdown>
            </Typography>
            <Chip
              className={classes.owner}
              label={
                <Fragment>
                  owned by:&nbsp;&nbsp;<em>{task.metadata.owner}</em>
                </Fragment>
              }
            />
            <Divider className={classes.divider} />
            <Grid container spacing={24}>
              <Grid item xs={12} md={6}>
                <TaskDetailsCard task={task} dependentTasks={dependentTasks} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TaskRunsCard
                  selectedRunId={
                    match.params.runId
                      ? parseInt(match.params.runId, 10)
                      : task.status.runs.length - 1
                  }
                  runs={task.status.runs}
                  workerType={task.workerType}
                  provisionerId={task.provisionerId}
                  onArtifactsPageChange={this.handleArtifactsPageChange}
                />
              </Grid>
            </Grid>
            {taskActions && taskActions.length ? (
              <SpeedDial>
                {taskActions.map(action => (
                  <SpeedDialAction
                    requiresAuth
                    tooltipOpen
                    key={action.title}
                    ButtonProps={{
                      name: action.name,
                      color: 'primary',
                      disabled: actionLoading,
                    }}
                    icon={<HammerIcon />}
                    tooltipTitle={action.title}
                    onClick={this.handleActionClick}
                  />
                ))}
              </SpeedDial>
            ) : null}
            {dialogOpen && (
              <DialogAction
                fullScreen={Boolean(selectedAction.schema)}
                open={dialogOpen}
                onSubmit={this.handleActionTaskSubmit(selectedAction)}
                onComplete={this.handleActionTaskComplete(selectedAction)}
                onError={this.handleTaskActionError}
                onClose={this.handleActionDialogClose}
                title={selectedAction.title}
                body={
                  <TaskActionForm
                    action={selectedAction}
                    form={actionInputs[selectedAction.name]}
                    onFormChange={this.handleFormChange}
                  />
                }
                confirmText={selectedAction.title}
              />
            )}
          </Fragment>
        )}
      </Dashboard>
    );
  }
}
