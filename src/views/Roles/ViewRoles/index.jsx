import { hot } from 'react-hot-loader';
import React, { PureComponent, Fragment } from 'react';
import { graphql } from 'react-apollo';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PlusIcon from 'mdi-react/PlusIcon';
import dotProp from 'dot-prop-immutable';
import Dashboard from '../../../components/Dashboard';
import Search from '../../../components/Search';
import Button from '../../../components/Button';
import RolesTable from '../../../components/RolesTable';
import HelpView from '../../../components/HelpView';
import ErrorPanel from '../../../components/ErrorPanel';
import rolesQuery from './roles.graphql';
import { VIEW_ROLES_PAGE_SIZE } from '../../../utils/constants';

@hot(module)
@graphql(rolesQuery, {
  options: () => ({
    variables: {
      rolesConnection: {
        limit: VIEW_ROLES_PAGE_SIZE,
      },
    },
  }),
})
@withStyles(theme => ({
  plusIcon: {
    ...theme.mixins.fab,
  },
}))
export default class ViewRoles extends PureComponent {
  state = {
    roleSearch: '',
  };

  handleCreate = () => {
    this.props.history.push('/auth/roles/create');
  };

  handleRoleSearchSubmit = roleSearch => {
    this.setState({ roleSearch });
  };

  handlePageChange = ({ cursor, previousCursor }) => {
    const {
      data: { fetchMore },
    } = this.props;

    return fetchMore({
      query: rolesQuery,
      variables: {
        rolesConnection: {
          limit: VIEW_ROLES_PAGE_SIZE,
          cursor,
          previousCursor,
        },
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        const { edges, pageInfo } = fetchMoreResult.listRoleIds;

        return dotProp.set(previousResult, 'listRoleIds', listRoleIds =>
          dotProp.set(
            dotProp.set(listRoleIds, 'edges', edges),
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
      description,
      data: { loading, error, listRoleIds },
    } = this.props;
    const { roleSearch } = this.state;

    return (
      <Dashboard
        title="Roles"
        helpView={<HelpView description={description} />}
        search={
          <Search
            disabled={loading}
            onSubmit={this.handleRoleSearchSubmit}
            placeholder="Role contains"
          />
        }>
        <Fragment>
          {!listRoleIds && loading && <Spinner loading />}
          <ErrorPanel error={error} />
          {listRoleIds && (
            <RolesTable
              searchTerm={roleSearch}
              onPageChange={this.handlePageChange}
              rolesConnection={listRoleIds}
            />
          )}
          <Tooltip title="Create Role">
            <Button
              onClick={this.handleCreate}
              variant="round"
              color="secondary"
              className={classes.plusIcon}>
              <PlusIcon />
            </Button>
          </Tooltip>
        </Fragment>
      </Dashboard>
    );
  }
}
