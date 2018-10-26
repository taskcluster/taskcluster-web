import { hot } from 'react-hot-loader';
import React, { PureComponent, Fragment } from 'react';
import { graphql } from 'react-apollo';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { withStyles } from '@material-ui/core/styles';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import Search from '../../../components/Search';
import Button from '../../../components/Button';
import RolesTable from '../../../components/RolesTable';
import HelpView from '../../../components/HelpView';
import ErrorPanel from '../../../components/ErrorPanel';
import rolesQuery from './roles.graphql';

@hot(module)
@graphql(rolesQuery)
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

  handleRoleSearchChange = ({ target }) => {
    this.setState({ roleSearch: target.value });
  };

  render() {
    const {
      classes,
      description,
      data: { loading, error, roles },
    } = this.props;
    const { roleSearch } = this.state;

    return (
      <Dashboard
        title="Roles"
        helpView={<HelpView description={description} />}
        search={
          <Search
            disabled={loading}
            value={roleSearch}
            onChange={this.handleRoleSearchChange}
            placeholder="Role starts with"
          />
        }
      >
        <Fragment>
          {!roles && loading && <Spinner loading />}
          <ErrorPanel error={error} />
          {roles && <RolesTable roles={roles} />}
          <Button
            onClick={this.handleCreate}
            variant="fab"
            color="secondary"
            className={classes.plusIcon}
          >
            <PlusIcon />
          </Button>
        </Fragment>
      </Dashboard>
    );
  }
}
