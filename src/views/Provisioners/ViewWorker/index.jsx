import { PureComponent, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { graphql } from 'react-apollo/index';
import { withStyles } from 'material-ui/styles';
import Dashboard from '../../../components/Dashboard';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import WorkerDetailsCard from '../../../components/WorkerDetailsCard';
import WorkerTable from '../../../components/WorkerTable';
import workerQuery from './worker.graphql';

@hot(module)
@graphql(workerQuery, {
  skip: ({ match: { params } }) => !params.provisionerId,
  options: ({ match: { params } }) => ({
    variables: {
      provisionerId: params.provisionerId,
      workerType: params.workerType,
      workerGroup: params.workerGroup,
      workerId: params.workerId,
    },
  }),
})
@withStyles(theme => ({
  actionButton: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
}))
export default class ViewWorker extends PureComponent {
  render() {
    const {
      user,
      onSignIn,
      onSignOut,
      data: { loading, error, worker },
    } = this.props;

    return (
      <Dashboard
        title="View Worker"
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}>
        <Fragment>
          {loading && <Spinner loading />}
          {error && error.graphQLErrors && <ErrorPanel error={error} />}
          {worker && (
            <Fragment>
              <WorkerDetailsCard worker={worker} />
              <br />
              <WorkerTable worker={worker} />
            </Fragment>
          )}
        </Fragment>
      </Dashboard>
    );
  }
}
