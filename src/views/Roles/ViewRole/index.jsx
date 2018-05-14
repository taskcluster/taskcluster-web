import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import Dashboard from '../../../components/Dashboard';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import RoleForm from '../../../components/RoleForm';
import roleQuery from './role.graphql';

@hot(module)
@graphql(roleQuery, {
  skip: ({ match: { params } }) => !params.roleId,
  options: ({ match: { params } }) => ({
    variables: {
      roleId: decodeURIComponent(params.roleId),
    },
  }),
})
export default class ViewRole extends Component {
  render() {
    const { user, onSignIn, onSignOut, isNewRole, data } = this.props;

    return (
      <Dashboard
        title={isNewRole ? 'Create Role' : 'Role'}
        user={user}
        onSignIn={onSignIn}
        onSignOut={onSignOut}>
        {isNewRole ? (
          <RoleForm isNewRole />
        ) : (
          <Fragment>
            {data.loading && <Spinner loading />}
            {data &&
              data.error &&
              data.error.graphQLErrors && (
                <ErrorPanel error={data.error.graphQLErrors[0].message} />
              )}
            {data && data.role && <RoleForm role={data.role} />}
          </Fragment>
        )}
      </Dashboard>
    );
  }
}
