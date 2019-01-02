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
import { withAuth } from '../../../utils/Auth';
import { VIEW_ROLES_PAGE_SIZE } from '../../../utils/constants';

@hot(module)
@withAuth
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
    // This needs to be initially null in order for the defaultValue to work
    value: null,
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset state to reflect new user / log out and default clientSearch query

    return {
      roleSearch: state.roleSearch,
    };
  }

  handleRoleSearchSubmit = roleSearch => {
    const {
      data: { refetch },
    } = this.props;

    this.setState({ roleSearch });

    refetch({
      filter: {
        ...(roleSearch ? { roleId: { $regex: roleSearch } } : null),
      },
      rolesConnection: {
        limit: VIEW_ROLES_PAGE_SIZE,
      },
    });
  };

  handleCreate = () => {
    this.props.history.push('/auth/roles/create');
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
        ...(this.state.roleSearch
          ? {
              filter: {
                roleId: {
                  $regex: this.state.roleSearch,
                },
              },
            }
          : null),
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

  handleRoleSearchChange = ({ target: { value } }) => {
    this.setState({ value });
  };

  render() {
    const {
      classes,
      description,
      data: { loading, error, listRoleIds },
    } = this.props;
    const { value } = this.state;
    const searchDefaultValue = this.props.user
      ? this.props.user.credentials.clientId
      : null;

    return (
      <Dashboard
        title="Roles"
        helpView={<HelpView description={description} />}
        search={
          <Search
            disabled={loading}
            onSubmit={this.handleRoleSearchSubmit}
            onChange={this.handleRoleSearchChange}
            defaultValue={searchDefaultValue}
            value={value}
            placeholder="Role contains"
          />
        }>
        <Fragment>
          {loading && <Spinner loading />}
          <ErrorPanel error={error} />
          {listRoleIds && (
            <RolesTable
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
