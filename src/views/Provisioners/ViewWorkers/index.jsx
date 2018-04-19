import { hot } from 'react-hot-loader';
import { PureComponent, Fragment } from 'react';
import { graphql } from 'react-apollo/index';
import dotProp from 'dot-prop-immutable';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { MenuItem } from 'material-ui/Menu';
import Dropdown from '../../../components/Dropdown';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import WorkersTable from '../../../components/WorkersTable';
import Dashboard from '../../../components/Dashboard';
import { VIEW_WORKERS_PAGE_SIZE } from '../../../utils/constants';
import workersQuery from './workers.graphql';

@hot(module)
@graphql(workersQuery, {
  skip: ({ match: { params } }) => !params.provisionerId,
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
@withStyles(theme => ({
  actionButton: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: theme.spacing.double,
    paddingBottom: theme.spacing.double,
    '&:last-child': {
      paddingBottom: theme.spacing.triple,
    },
  },
}))
export default class ViewWorkers extends PureComponent {
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

  renderActions = () => {
    const {
      classes,
      data: {
        workerType: { actions },
      },
    } = this.props;

    return actions.length
      ? actions.map(action => (
          <Tooltip
            enterDelay={300}
            key={action.title}
            id={`${action.title}-tooltip`}
            title={action.description}>
            <Button
              onClick={() => this.handleActionClick(action)}
              className={classes.actionButton}
              size="small"
              variant="raised">
              {action.title}
            </Button>
          </Tooltip>
        ))
      : 'n/a';
  };

  render() {
    const { filterBy } = this.state;
    const {
      classes,
      user,
      onSignIn,
      onSignOut,
      match: {
        params: { provisionerId, workerType },
      },
      data: { loading, error, workers },
    } = this.props;

    return (
      <Dashboard
        title="View Workers"
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}>
        <Fragment>
          {!workers && loading && <Spinner loading />}
          {error && error.graphQLErrors && <ErrorPanel error={error} />}
          {workers && (
            <Fragment>
              <Card>
                <CardContent className={classes.cardContent}>
                  <List>
                    <ListItem>
                      <Dropdown
                        disabled={loading}
                        onChange={this.handleFilterChange}
                        value={filterBy || ''}
                        inputLabel="Filter By">
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Quarantined">Quarantined</MenuItem>
                      </Dropdown>
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Actions"
                        secondary={this.renderActions()}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <br />
              {loading ? (
                <Spinner loading />
              ) : (
                <WorkersTable
                  workersConnection={workers}
                  onPageChange={this.handlePageChange}
                  workerType={workerType}
                  provisionerId={provisionerId}
                />
              )}
            </Fragment>
          )}
        </Fragment>
      </Dashboard>
    );
  }
}
