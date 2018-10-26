import { hot } from 'react-hot-loader';
import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import dotProp from 'dot-prop-immutable';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PlusIcon from 'mdi-react/PlusIcon';
import Dashboard from '../../../components/Dashboard';
import SecretsTable from '../../../components/SecretsTable';
import HelpView from '../../../components/HelpView';
import Button from '../../../components/Button';
import { VIEW_SECRETS_PAGE_SIZE } from '../../../utils/constants';
import ErrorPanel from '../../../components/ErrorPanel';
import secretsQuery from './secrets.graphql';

@hot(module)
@graphql(secretsQuery, {
  options: () => ({
    variables: {
      secretsConnection: {
        limit: VIEW_SECRETS_PAGE_SIZE,
      },
    },
  }),
})
@withStyles(theme => ({
  plusIcon: {
    ...theme.mixins.fab,
  },
}))
export default class ViewSecrets extends Component {
  handleCreate = () => {
    this.props.history.push('/secrets/create');
  };

  handlePageChange = ({ cursor, previousCursor }) => {
    const {
      data: { fetchMore },
    } = this.props;

    return fetchMore({
      query: secretsQuery,
      variables: {
        secretsConnection: {
          limit: VIEW_SECRETS_PAGE_SIZE,
          cursor,
          previousCursor,
        },
      },
      updateQuery(previousResult, { fetchMoreResult }) {
        const { edges, pageInfo } = fetchMoreResult.secrets;

        if (!edges.length) {
          return previousResult;
        }

        return dotProp.set(previousResult, 'secrets', secrets =>
          dotProp.set(
            dotProp.set(secrets, 'edges', edges),
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
      data: { loading, error, secrets },
    } = this.props;

    return (
      <Dashboard
        title="Secrets"
        helpView={<HelpView description={description} />}
      >
        <Fragment>
          {!secrets && loading && <Spinner loading />}
          <ErrorPanel error={error} />
          {secrets && (
            <SecretsTable
              onPageChange={this.handlePageChange}
              secretsConnection={secrets}
            />
          )}
          <Tooltip
            enterDelay={300}
            id="create-secret-tooltip"
            title="Create Secret"
          >
            <Button
              onClick={this.handleCreate}
              variant="fab"
              color="secondary"
              className={classes.plusIcon}
            >
              <PlusIcon />
            </Button>
          </Tooltip>
        </Fragment>
      </Dashboard>
    );
  }
}
