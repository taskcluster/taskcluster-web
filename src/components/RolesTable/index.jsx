import { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { string, arrayOf } from 'prop-types';
import {
  memoizeWith,
  pipe,
  prop,
  map,
  ifElse,
  isEmpty,
  filter,
  contains,
  identity,
  sort as rSort,
} from 'ramda';
import { camelCase } from 'change-case/change-case';
import { TableRow, TableCell } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import { ListItemText } from 'material-ui/List';
import LinkIcon from 'mdi-react/LinkIcon';
import TableCellListItem from '../TableCellListItem';
import { role } from '../../utils/prop-types';
import sort from '../../utils/sort';
import DataTable from '../DataTable';

const sorted = pipe(
  rSort((a, b) => sort(a.roleId, b.roleId)),
  map(({ roleId }) => roleId)
);

export default class RolesTable extends Component {
  static propTypes = {
    /** A GraphQL roles response. */
    roles: arrayOf(role).isRequired,
    /** A search term to refine the list of roles */
    searchTerm: string,
  };

  static defaultProps = {
    searchTerm: null,
  };

  state = {
    sortBy: null,
    sortDirection: null,
  };

  handleHeaderClick = sortBy => {
    const toggled = this.state.sortDirection === 'desc' ? 'asc' : 'desc';
    const sortDirection = this.state.sortBy === sortBy ? toggled : 'desc';

    this.setState({ sortBy, sortDirection });
  };

  createSortedRoles = memoizeWith(
    (roles, sortBy, sortDirection, searchTerm) => {
      const ids = sorted(roles);

      return `${ids.join('-')}-${sortBy}-${sortDirection}-${searchTerm}`;
    },
    (roles, sortBy, sortDirection, searchTerm) => {
      const sortByProperty = camelCase(sortBy);
      const filteredRoles = ifElse(
        () => Boolean(searchTerm),
        filter(pipe(prop('roleId'), contains(searchTerm))),
        identity
      )(roles);

      return ifElse(
        isEmpty,
        identity,
        rSort((a, b) => {
          const firstElement =
            sortDirection === 'desc' ? b[sortByProperty] : a[sortByProperty];
          const secondElement =
            sortDirection === 'desc' ? a[sortByProperty] : b[sortByProperty];

          return sort(firstElement, secondElement);
        })
      )(filteredRoles);
    }
  );

  render() {
    const { roles, searchTerm } = this.props;
    const { sortBy, sortDirection } = this.state;
    const sortedRoles = this.createSortedRoles(
      roles,
      sortBy,
      sortDirection,
      searchTerm
    );
    const iconSize = 16;

    return (
      <Fragment>
        <DataTable
          items={sortedRoles}
          headers={['Role ID']}
          sortByHeader={sortBy}
          sortDirection={sortDirection}
          onHeaderClick={this.handleHeaderClick}
          renderRow={({ roleId }) => (
            <TableRow key={roleId}>
              <TableCell>
                <TableCellListItem
                  dense
                  button
                  component={Link}
                  to={`/auth/roles/${encodeURIComponent(roleId)}`}>
                  <ListItemText
                    disableTypography
                    primary={<Typography variant="body1">{roleId}</Typography>}
                  />
                  <LinkIcon size={iconSize} />
                </TableCellListItem>
              </TableCell>
            </TableRow>
          )}
        />
      </Fragment>
    );
  }
}
