import React, { PureComponent, Fragment } from 'react';
import { hot } from 'react-hot-loader';
import { graphql } from 'react-apollo';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { withStyles } from '@material-ui/core/styles';
import PlusIcon from 'mdi-react/PlusIcon';
import dotProp from 'dot-prop-immutable';
import Dashboard from '../../../components/Dashboard';
import Search from '../../../components/Search';
import HelpView from '../../../components/HelpView';
import Button from '../../../components/Button';
import ClientsTable from '../../../components/ClientsTable';
import { VIEW_CLIENTS_PAGE_SIZE } from '../../../utils/constants';
import clientsQuery from './clients.graphql';
import { withAuth } from '../../../utils/Auth';

@hot(module)
@withAuth
@graphql(clientsQuery, {
  options: props => ({
    variables: {
      clientOptions: {
        ...(props.user ? { prefix: props.user.credentials.clientId } : null),
      },
      clientsConnection: {
        limit: VIEW_CLIENTS_PAGE_SIZE,
      },
    },
  }),
})
@withStyles(theme => ({
  plusIcon: {
    ...theme.mixins.fab,
  },
}))
export default class ViewClients extends PureComponent {
  state = {
    clientSearch: '',
    // eslint-disable-next-line react/no-unused-state
    previousClientId: '',
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset state to reflect new user / log out and default clientSearch query
    if (
      props.user &&
      props.user.credentials.clientId !== state.previousClientId
    ) {
      return {
        clientSearch: props.user.credentials.clientId,
        previousClientId: props.user.credentials.clientId,
      };
    }
    if (!props.user && state.previousClientId !== '') {
      return {
        clientSearch: '',
        previousClientId: '',
      };
    }

    return null;
  }

  handleClientSearchChange = ({ target }) => {
    this.setState({ clientSearch: target.value });
  };

  handleClientSearchSubmit = e => {
    e.preventDefault();

    const {
      data: { refetch },
    } = this.props;
    const { clientSearch } = this.state;

    refetch({
      ...(clientSearch
        ? {
            clientOptions: {
              prefix: clientSearch,
            },
          }
        : null),
      clientsConnection: {
        limit: VIEW_CLIENTS_PAGE_SIZE,
      },
    });
  };

  handleCreate = () => {
    this.props.history.push('/auth/clients/create');
  };

  handlePageChange = ({ cursor, previousCursor }) => {
    const {
      data: { fetchMore },
    } = this.props;

    return fetchMore({
      query: clientsQuery,
      variables: {
        clientsConnection: {
          limit: VIEW_CLIENTS_PAGE_SIZE,
          cursor,
          previousCursor,
        },
        ...(this.state.clientSearch
          ? {
              clientOptions: {
                prefix: this.state.clientSearch,
              },
            }
          : null),
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        const { edges, pageInfo } = fetchMoreResult.clients;

        if (!edges.length) {
          return previousResult;
        }

        return dotProp.set(previousResult, 'clients', clients =>
          dotProp.set(
            dotProp.set(clients, 'edges', edges),
            'pageInfo',
            pageInfo
          )
        );
      },
    });
  };

  handleClientSearchChange = ({ target }) => {
    this.setState({ clientSearch: target.value });
  };

  handleClientSearchSubmit = e => {
    e.preventDefault();

    const {
      data: { refetch },
    } = this.props;
    const { clientSearch } = this.state;

    refetch({
      clientOptions: {
        ...(clientSearch ? { prefix: clientSearch.trim() } : null),
      },
      clientsConnection: {
        limit: VIEW_CLIENTS_PAGE_SIZE,
      },
    });
  };

  handleCreate = () => {
    this.props.history.push('/auth/clients/create');
  };

  render() {
    const {
      classes,
      description,
      data: { loading, error, clients },
    } = this.props;
    const { clientSearch } = this.state;

    return (
      <Dashboard
        title="Clients"
        helpView={<HelpView description={description} />}
        search={
          <Search
            disabled={loading}
            value={clientSearch}
            onChange={this.handleClientSearchChange}
            onSubmit={this.handleClientSearchSubmit}
            placeholder="Client starts with"
          />
        }
      >
        <Fragment>
          {loading && <Spinner loading /> }
          {!clients && loading && <Spinner loading />}

          {error && error.graphQLErrors && <ErrorPanel error={error} />}
          {clients && (
            <ClientsTable
              onPageChange={this.handlePageChange}

              clientsConnection={clients}
            />
          )}

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
