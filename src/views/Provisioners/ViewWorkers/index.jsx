import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import dotProp from 'dot-prop-immutable';
import { withStyles } from 'material-ui/styles';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import HammerIcon from 'mdi-react/HammerIcon';
import { MenuItem } from 'material-ui/Menu';
import SpeedDial from '../../../components/SpeedDial';
import Dropdown from '../../../components/Dropdown';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import WorkersTable from '../../../components/WorkersTable';
import Dashboard from '../../../components/Dashboard';
import { VIEW_WORKERS_PAGE_SIZE } from '../../../utils/constants';
import workersQuery from './workers.graphql';

@hot(module)
@graphql(workersQuery, {
  skip: props => !props.match.params.provisionerId,
  options: ({ match: { params } }) => ({
    variables: {
      provisionerId: params.provisionerId,
      workerType: params.workerType,
      workersConnection: {
        limit: VIEW_WORKERS_PAGE_SIZE,
      },
    },
  }),
})
@withStyles({
  actionBar: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
})
export default class ViewWorkers extends Component {
  state = {
    filterBy: null,
  };

  handlePageChange = ({ cursor, previousCursor }) => {
    const {
      match: {
        params: { provisionerId, workerType },
      },
      data: { fetchMore },
    } = this.props;

    return fetchMore({
      query: workersQuery,
      variables: {
        provisionerId,
        workerType,
        workersConnection: {
          limit: VIEW_WORKERS_PAGE_SIZE,
          cursor,
          previousCursor,
        },
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        const { edges, pageInfo } = fetchMoreResult.workers;

        if (!edges.length) {
          return previousResult;
        }

        return dotProp.set(previousResult, 'workers', workers =>
          dotProp.set(
            dotProp.set(workers, 'edges', edges),
            'pageInfo',
            pageInfo
          )
        );
      },
    });
  };

  handleFilterChange = ({ target }) => {
    const {
      data: { refetch },
      match: {
        params: { provisionerId, workerType },
      },
    } = this.props;
    const quarantinedOpts =
      target.value === 'Quarantined' ? { quarantined: true } : null;

    this.setState({ filterBy: target.value });

    refetch({
      provisionerId,
      workerType,
      workersConnection: {
        limit: VIEW_WORKERS_PAGE_SIZE,
      },
      ...quarantinedOpts,
    });
  };

  // TODO: Handle action request
  handleActionClick() {}

  render() {
    const { filterBy } = this.state;
    const {
      classes,
      user,
      onSignIn,
      onSignOut,
      match: { params },
      data: { loading, error, workers, workerType },
    } = this.props;

    return (
      <Dashboard
        title="Workers"
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}>
        <Fragment>
          {(!workers || !workerType) && loading && <Spinner loading />}
          {error && error.graphQLErrors && <ErrorPanel error={error} />}
          {workers &&
            workerType && (
              <Fragment>
                <div className={classes.actionBar}>
                  <Dropdown
                    disabled={loading}
                    onChange={this.handleFilterChange}
                    value={filterBy || ''}
                    label="Filter By">
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Quarantined">Quarantined</MenuItem>
                  </Dropdown>
                </div>
                <br />
                <WorkersTable
                  workersConnection={workers}
                  onPageChange={this.handlePageChange}
                  workerType={params.workerType}
                  provisionerId={params.provisionerId}
                />
                <SpeedDial
                  title={
                    workerType.actions.length ? null : 'No actions available'
                  }>
                  {workerType.actions.map(action => (
                    <SpeedDialAction
                      key={action.title}
                      ButtonProps={{ color: 'secondary' }}
                      icon={<HammerIcon />}
                      tooltipTitle={
                        <div>
                          <div>{action.title}</div>
                          <div>{action.description}</div>
                        </div>
                      }
                      onClick={() => this.handleActionClick(action)}
                    />
                  ))}
                </SpeedDial>
              </Fragment>
            )}
        </Fragment>
      </Dashboard>
    );
  }
}
