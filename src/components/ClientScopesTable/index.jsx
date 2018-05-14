import { Component } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import {
  uniq,
  flatten,
  memoizeWith,
  filter,
  pipe,
  map,
  any,
  identity,
  contains,
  prop,
  sort as rSort,
} from 'ramda';
import { ListItemText } from 'material-ui/List';
import { TableRow, TableCell } from 'material-ui/Table';
import LinkIcon from 'mdi-react/LinkIcon';
import TableCellListItem from '../TableCellListItem';
import ConnectionDataTable from '../ConnectionDataTable';
import sort from '../../utils/sort';
import scopeMatch from '../../utils/scopeMatch';
import { VIEW_CLIENT_SCOPES_INSPECT_SIZE } from '../../utils/constants';
import { pageInfo, client, scopeExpansionLevel } from '../../utils/prop-types';

const sorted = pipe(
  rSort((a, b) => sort(a.node.clientId, b.node.clientId)),
  map(({ node: { clientId } }) => clientId)
);

export default class ClientScopesTable extends Component {
  static propTypes = {
    /** Callback function fired when a page is changed. */
    onPageChange: func.isRequired,
    /** Clients GraphQL PageConnection instance. */
    clientsConnection: shape({
      edges: arrayOf(client),
      pageInfo,
    }).isRequired,
    /** The entity search mode for scopes. */
    searchMode: string,
    /** The scope expansion level. */
    searchProperty: scopeExpansionLevel,
    /** A string to filter the list of results. */
    searchTerm: string,
    /**
     * If set, the component displays a list of role IDs
     * pertaining to that scope. Else, a list of scopes is shown.
     * */
    selectedScope: string,
  };

  static defaultProps = {
    searchTerm: null,
    selectedScope: null,
    searchMode: null,
    searchProperty: 'expandedScopes',
  };

  clientScopes = null;

  createSortedClientScopesConnection = memoizeWith(
    (clientsConnection, searchMode, selectedScope, searchProperty) => {
      const ids = sorted(clientsConnection.edges);

      return `${ids.join(
        '-'
      )}-${searchMode}-${selectedScope}-${searchProperty}`;
    },
    (clientsConnection, searchMode, selectedScope, searchProperty) => {
      const match = scopeMatch(searchMode, selectedScope);
      const extractExpandedScopes = pipe(
        map(pipe(prop('node'), prop('expandedScopes'))),
        flatten,
        uniq,
        searchMode ? filter(match) : identity,
        rSort(sort)
      );
      const extractClients = pipe(
        filter(pipe(prop('node'), prop(searchProperty), any(match))),
        map(pipe(prop('node'), prop('clientId'))),
        rSort(sort)
      );

      if (clientsConnection) {
        this.clientScopes = selectedScope
          ? extractClients(clientsConnection.edges)
          : extractExpandedScopes(clientsConnection.edges);
      }

      return clientsConnection;
    }
  );

  renderRow = (scope, index) => {
    const { searchTerm } = this.props;

    if (index !== 0) {
      return null;
    }

    return pipe(
      searchTerm ? filter(contains(searchTerm)) : identity,
      map(scope => (
        <TableRow key={`scope-${scope}`}>
          <TableCell padding="dense">
            <TableCellListItem
              button
              component={Link}
              to={`/auth/scopes/roles/${encodeURIComponent(scope)}`}>
              <ListItemText disableTypography primary={<code>{scope}</code>} />
              <LinkIcon size={16} />
            </TableCellListItem>
          </TableCell>
        </TableRow>
      ))
    )(this.clientScopes);
  };

  render() {
    const {
      clientsConnection,
      searchMode,
      selectedScope,
      searchProperty,
      onPageChange,
      ...props
    } = this.props;
    const connection = this.createSortedClientScopesConnection(
      clientsConnection,
      searchMode,
      selectedScope,
      searchProperty
    );

    return (
      <ConnectionDataTable
        columnsSize={1}
        connection={connection}
        pageSize={VIEW_CLIENT_SCOPES_INSPECT_SIZE}
        renderRow={this.renderRow}
        onPageChange={onPageChange}
        {...props}
      />
    );
  }
}
