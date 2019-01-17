import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { prop, map } from 'ramda';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { withStyles } from '@material-ui/core/styles';
import MuiTreeView from 'material-ui-treeview';
import PlusIcon from 'mdi-react/PlusIcon';
import qs from 'qs';
import Dashboard from '../../../components/Dashboard';
import HelpView from '../../../components/HelpView';
import Search from '../../../components/Search';
import Button from '../../../components/Button';
import ErrorPanel from '../../../components/ErrorPanel';
import hooksQuery from './hooks.graphql';

@hot(module)
@graphql(hooksQuery)
@withStyles(theme => ({
  actionButton: {
    ...theme.mixins.fab,
  },
  listItemProps: {
    button: true,
    color: '#fff',
  },
}))
export default class ListHooks extends Component {
  state = {
    hookSearch: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const searchString = qs.parse(nextProps.location.search, {
      ignoreQueryPrefix: true,
    }).search;

    if (prevState.hookSearch !== searchString) {
      return { hookSearch: searchString };
    }

    return null;
  }

  handleCreateHook = () => {
    this.props.history.push('/hooks/create');
  };

  handleHookSearchSubmit = hookSearch => {
    this.props.history.push(
      `/hooks${hookSearch ? `?search=${hookSearch}` : ''}`
    );
  };

  handleLeafClick = ({ value, parent }) => {
    this.props.history.push(
      `/hooks/${parent.value}/${encodeURIComponent(value)}`
    );
  };

  render() {
    const {
      classes,
      description,
      data: { loading, error, hookGroups },
    } = this.props;
    const { hookSearch } = this.state;
    const tree = hookGroups
      ? hookGroups.map(group => ({
          value: group.hookGroupId,
          nodes: map(prop('hookId'), group.hooks),
        }))
      : [];

    return (
      <Dashboard
        title="Hooks"
        helpView={<HelpView description={description} />}
        search={
          <Search
            placeholder="Hook contains"
            defaultValue={hookSearch}
            onSubmit={this.handleHookSearchSubmit}
          />
        }>
        {!hookGroups && loading && <Spinner loading />}
        <ErrorPanel error={error} />
        {hookGroups && (
          <MuiTreeView
            // key is necessary to expand the list of hook when searching
            key={hookSearch}
            defaultExpanded={Boolean(hookSearch)}
            listItemProps={{ color: classes.listItemProps }}
            searchTerm={hookSearch || null}
            tree={tree}
            onLeafClick={this.handleLeafClick}
          />
        )}
        <Button
          spanProps={{ className: classes.actionButton }}
          tooltipProps={{ title: 'Create Hook' }}
          color="secondary"
          variant="round"
          onClick={this.handleCreateHook}>
          <PlusIcon />
        </Button>
      </Dashboard>
    );
  }
}
