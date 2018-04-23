import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { withStyles } from 'material-ui/styles';
import Dashboard from '../../../components/Dashboard';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import WorkerDetailsCard from '../../../components/WorkerDetailsCard';
import WorkerTable from '../../../components/WorkerTable';
import workerQuery from './worker.graphql';

@hot(module)
@graphql(workerQuery, {
  skip: props => !props.match.params.provisionerId,
  options: ({ match: { params } }) => ({
    variables: params,
  }),
})
@withStyles(theme => ({
  actionButton: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
}))
export default class ViewWorker extends Component {
  render() {
    const {
      user,
      onSignIn,
      onSignOut,
      data: { loading, error, worker },
    } = this.props;

    return (
      <Dashboard
        title="Worker"
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
