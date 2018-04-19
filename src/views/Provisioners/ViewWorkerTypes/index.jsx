import { PureComponent, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { graphql } from 'react-apollo/index';
import dotProp from 'dot-prop-immutable';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import { MenuItem } from 'material-ui/Menu';
import Dropdown from '../../../components/Dropdown';
import Spinner from '../../../components/Spinner';
import WorkerTypesTable from '../../../components/WorkerTypesTable';
import ErrorPanel from '../../../components/ErrorPanel';
import Dashboard from '../../../components/Dashboard';
import { VIEW_WORKER_TYPES_PAGE_SIZE } from '../../../utils/constants';
import workerTypesQuery from './workerTypes.graphql';

@hot(module)
@withStyles(theme => ({
  description: {
    padding: theme.spacing.triple,
  },
}))
@graphql(workerTypesQuery, {
  skip: ({
    match: {
      params: { provisionerId },
    },
  }) => !provisionerId,
  options: ({
    match: {
      params: { provisionerId },
    },
  }) => ({
    variables: {
      provisionerId,
      workerTypesConnection: {
        limit: VIEW_WORKER_TYPES_PAGE_SIZE,
      },
      isAwsProvisioner: provisionerId === 'aws-provisioner-v1',
    },
  }),
})
export default class ViewWorkerTypes extends PureComponent {
  handleProvisionerChange = ({ target }) => {
    this.props.history.replace(`/provisioners/${target.value}/worker-types`);
  };

  handlePageChange = ({ cursor, previousCursor }) => {
    const {
      match: {
        params: { provisionerId },
      },
      data: { fetchMore },
    } = this.props;

    return fetchMore({
      query: workerTypesQuery,
      variables: {
        provisionerId,
        workerTypesConnection: {
          limit: VIEW_WORKER_TYPES_PAGE_SIZE,
          cursor,
          previousCursor,
        },
        isAwsProvisioner: provisionerId === 'aws-provisioner-v1',
      },
      updateQuery(
        previousResult,
        {
          fetchMoreResult: { workerTypes },
        }
      ) {
        const { edges, pageInfo } = workerTypes;

        if (!edges.length) {
          return previousResult;
        }

        return dotProp.set(previousResult, `workerTypes`, workerTypes =>
          dotProp.set(
            dotProp.set(workerTypes, 'edges', edges),
            'pageInfo',
            pageInfo
          )
        );
      },
    });
  };

  render() {
    const {
      match: {
        params: { provisionerId },
      },
      user,
      onSignIn,
      onSignOut,
      data: {
        loading,
        error,
        provisioners,
        workerTypes,
        awsProvisionerWorkerTypeSummaries,
      },
    } = this.props;

    return (
      <Dashboard
        title="View Worker Types"
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}>
        <Fragment>
          {!workerTypes && loading && <Spinner loading />}
          {error && error.graphQLErrors && <ErrorPanel error={error} />}
          {provisioners &&
            workerTypes && (
              <Fragment>
                <Card>
                  <CardContent>
                    <Dropdown
                      disabled={loading}
                      onChange={this.handleProvisionerChange}
                      value={provisionerId}
                      inputLabel="Provisioner ID">
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {provisioners.edges.map(({ node }) => (
                        <MenuItem
                          key={node.provisionerId}
                          value={node.provisionerId}>
                          {node.provisionerId}
                        </MenuItem>
                      ))}
                    </Dropdown>
                  </CardContent>
                </Card>
                <WorkerTypesTable
                  workerTypesConnection={workerTypes}
                  provisionerId={provisionerId}
                  onPageChange={this.handlePageChange}
                  awsProvisionerWorkerTypeSummaries={
                    awsProvisionerWorkerTypeSummaries
                  }
                />
              </Fragment>
            )}
        </Fragment>
      </Dashboard>
    );
  }
}
