import { hot } from 'react-hot-loader';
import React, { Component, Fragment } from 'react';
import { graphql, withApollo, compose } from 'react-apollo';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import Dashboard from '../../../components/Dashboard';
import HookForm from '../../../components/HookForm';
import ErrorPanel from '../../../components/ErrorPanel';
import hookQuery from './hook.graphql';
import createHookQuery from './createHook.graphql';
import deleteHookQuery from './deleteHook.graphql';
import updateHookQuery from './updateHook.graphql';
import triggerHookQuery from './triggerHook.graphql';
import hookLastFiresQuery from './hookLastFires.graphql';

@hot(module)
@withApollo
@compose(
  graphql(hookLastFiresQuery, {
    skip: ({ match: { params } }) => !params.hookId,
    options: ({ match: { params } }) => ({
      variables: {
        hookGroupId: params.hookGroupId,
        hookId: decodeURIComponent(params.hookId),
      },
    }),
    name: 'lastFiresData',
  }),
  graphql(hookQuery, {
    skip: ({ match: { params } }) => !params.hookId,
    options: ({ match: { params } }) => ({
      variables: {
        hookGroupId: params.hookGroupId,
        hookId: decodeURIComponent(params.hookId),
      },
    }),
    name: 'hookData',
  })
)
export default class ViewHook extends Component {
  state = {
    actionLoading: false,
    error: null,
    dialogError: null,
    dialogOpen: false,
  };

  preRunningAction = () => {
    this.setState({ dialogError: null, actionLoading: true });
  };

  handleCreateHook = async ({ hookId, hookGroupId, payload }) => {
    this.preRunningAction();

    try {
      await this.props.client.mutate({
        mutation: createHookQuery,
        variables: {
          hookId,
          hookGroupId,
          payload,
        },
      });

      this.props.history.push(
        `/hooks/${encodeURIComponent(hookGroupId)}/${hookId}`
      );

      await this.props.data.refetch();
      this.setState({ error: null, actionLoading: false });
    } catch (error) {
      this.setState({ error, actionLoading: false });
    }
  };

  handleDeleteHook = async ({ hookId, hookGroupId }) => {
    this.preRunningAction();

    try {
      await this.props.client.mutate({
        mutation: deleteHookQuery,
        variables: {
          hookId,
          hookGroupId,
        },
      });

      this.setState({ error: null, actionLoading: false });
      this.props.history.push('/hooks');
    } catch (error) {
      this.setState({ error, actionLoading: false });
    }
  };

  handleTriggerHook = async ({ hookGroupId, hookId, payload }) => {
    this.preRunningAction();

    await this.props.client.mutate({
      mutation: triggerHookQuery,
      variables: {
        hookId,
        hookGroupId,
        payload,
      },
    });
    await this.props.data.refetch();
  };

  handleUpdateHook = async ({ hookGroupId, hookId, payload }) => {
    this.preRunningAction();

    try {
      await this.props.client.mutate({
        mutation: updateHookQuery,
        variables: {
          hookId,
          hookGroupId,
          payload,
        },
      });

      this.setState({ error: null, actionLoading: false });
    } catch (error) {
      this.setState({ error, actionLoading: false });
    }
  };

  handleActionDialogClose = () => {
    this.setState({
      actionLoading: false,
      dialogOpen: false,
      dialogError: null,
      error: null,
    });
  };

  handleDialogOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogActionError = error => {
    this.setState({ dialogError: error, actionLoading: false });
  };

  render() {
    const { isNewHook, hookData, lastFiresData } = this.props;
    const { error: err, dialogError, actionLoading, dialogOpen } = this.state;
    const hookDataError = (hookData && hookData.error) || err;

    return (
      <Dashboard title={isNewHook ? 'Create Hook' : 'Hook'}>
        <ErrorPanel error={hookDataError} />
        {isNewHook ? (
          <Fragment>
            <HookForm
              isNewHook
              dialogError={dialogError}
              actionLoading={actionLoading}
              onCreateHook={this.handleCreateHook}
            />
          </Fragment>
        ) : (
          <Fragment>
            {!hookData.hook && hookData.loading && <Spinner loading />}
            {hookData.hook && (
              <HookForm
                dialogError={dialogError}
                actionLoading={actionLoading}
                hook={hookData.hook}
                hookLastFires={lastFiresData.hookLastFires.sort(
                  (a, b) =>
                    new Date(b.taskCreateTime) - new Date(a.taskCreateTime)
                )}
                dialogOpen={dialogOpen}
                onTriggerHook={this.handleTriggerHook}
                onUpdateHook={this.handleUpdateHook}
                onDeleteHook={this.handleDeleteHook}
                onActionDialogClose={this.handleActionDialogClose}
                onDialogActionError={this.handleDialogActionError}
                onDialogOpen={this.handleDialogOpen}
              />
            )}
          </Fragment>
        )}
      </Dashboard>
    );
  }
}
