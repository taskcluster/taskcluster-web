import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { string, shape, func, arrayOf } from 'prop-types';
import { pipe, map, sort as rSort } from 'ramda';
import memoize from 'fast-memoize';
import { camelCase } from 'change-case/change-case';
import { withStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import LinkIcon from 'mdi-react/LinkIcon';
import sort from '../../utils/sort';
import ConnectionDataTable from '../ConnectionDataTable';
import { VIEW_ROLES_PAGE_SIZE } from '../../utils/constants';
import { pageInfo, client } from '../../utils/prop-types';

const sorted = pipe(
  rSort((a, b) => sort(a.roleId, b.roleId)),
  map(({ roleId }) => roleId)
);

@withStyles(theme => ({
  tableCell: {
    textDecoration: 'none',
  },
  listItemCell: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: theme.spacing.unit,
    ...theme.mixins.hover,
  },
}))
export default class RolesTable extends Component {
  static defaultProps = {
    searchTerm: null,
  };

  static propTypes = {
    clientsConnection: shape({
      edges: arrayOf(client),
      pageInfo,
    }).isRequired,
    onPageChange: func.isRequired,
    /** A search term to refine the list of roles */
    searchTerm: string,
  };

  state = {
    sortBy: null,
    sortDirection: null,
  };

  createSortedClientsConnection = memoize(
    (clientsConnection, sortBy, sortDirection, searchTerm) => {
      const sortByProperty = camelCase(sortBy);

      if (!sortBy) {
        return clientsConnection;
      }

      const filteredClientsConnection = searchTerm
        ? {
            ...clientsConnection,
            edges: [...clientsConnection.edges].filter(({ node }) =>
              node.roleId.includes(searchTerm)
            ),
          }
        : clientsConnection;

      return {
        ...filteredClientsConnection,
        edges: [...filteredClientsConnection.edges].sort((a, b) => {
          const firstElement =
            sortDirection === 'desc'
              ? b.node[sortByProperty]
              : a.node[sortByProperty];
          const secondElement =
            sortDirection === 'desc'
              ? a.node[sortByProperty]
              : b.node[sortByProperty];

          return sort(firstElement, secondElement);
        }),
      };
    },
    {
      serializer: ([filteredClientsConnection, sortBy, sortDirection]) => {
        const ids = sorted(filteredClientsConnection.edges);

        return `${ids.join('-')}-${sortBy}-${sortDirection}`;
      },
    }
  );

  handleHeaderClick = sortBy => {
    const toggled = this.state.sortDirection === 'desc' ? 'asc' : 'desc';
    const sortDirection = this.state.sortBy === sortBy ? toggled : 'desc';

    this.setState({ sortBy, sortDirection });
  };

  render() {
    const { classes, onPageChange, clientsConnection, searchTerm } = this.props;
    const { sortBy, sortDirection } = this.state;
    const iconSize = 16;

    return (
      <ConnectionDataTable
        connection={this.createSortedClientsConnection(
          clientsConnection,
          sortBy,
          sortDirection,
          searchTerm
        )}
        pageSize={VIEW_ROLES_PAGE_SIZE}
        onHeaderClick={this.handleHeaderClick}
        onPageChange={onPageChange}
        headers={['Role ID']}
        sortByHeader={sortBy}
        sortDirection={sortDirection}
        renderRow={({ node: role }) => (
          <TableRow key={role.roleId}>
            <TableCell padding="dense">
              <Link
                className={classes.tableCell}
                to={`/auth/roles/${encodeURIComponent(role.roleId)}`}>
                <div className={classes.listItemCell}>
                  <Typography>{role.roleId}</Typography>
                  <LinkIcon size={iconSize} />
                </div>
              </Link>
            </TableCell>
          </TableRow>
        )}
      />
    );
  }
}
