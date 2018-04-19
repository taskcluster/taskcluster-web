import { Component } from 'react';
import { array, arrayOf, func, number, shape, string, oneOf } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableSortLabel,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import Spinner from '../Spinner';
import { pageInfo } from '../../utils/prop-types';

@withStyles({
  loading: {
    textAlign: 'right',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
})
/**
 * A paginated table that operates on a GraphQL PageConnection.
 */
export default class ConnectionDataTable extends Component {
  static propTypes = {
    /**
     * A GraphQL PageConnection instance.
     */
    connection: shape({
      edges: array,
      pageInfo,
    }).isRequired,
    /**
     * The maximum number of records to display per page.
     */
    pageSize: number.isRequired,
    /**
     * The number of columns the table contains.
     */
    columnsSize: number.isRequired,
    /**
     * A function to execute for each row to render in the table.
     * Will be passed a single edge from the connection. The function
     * should return the JSX necessary to render the given edge row.
     */
    renderRow: func.isRequired,
    /**
     * A function to execute when paging. Will receive a single argument
     * which is an object in the form of `{ cursor, previousCursor }`. This
     * can be used to query the next/previous set in a page connection. Should
     * return a Promise which waits for the next page connection.
     */
    onPageChange: func.isRequired,
    /**
     * A function to execute when a column header is clicked.
     * Will receive a single argument which is the column name.
     * This can be used to handle sorting.
     */
    onHeaderClick: func,
    /**
     * A header name to sort on.
     */
    sortByHeader: string,
    /**
     * The sorting direction.
     */
    sortDirection: oneOf(['desc', 'asc']),
    /**
     * A list of header names to use on the table starting from the left.
     */
    headers: arrayOf(string),
  };

  static defaultProps = {
    sortByHeader: null,
    sortDirection: 'desc',
    headers: null,
  };

  pages = new Map();
  state = {
    loading: false,
  };

  handlePageChange = (e, nextPage) => {
    const { connection, onPageChange } = this.props;
    const { page, pageInfo } = this.pages.get(connection.pageInfo.cursor);
    const cursor =
      nextPage > page ? pageInfo.nextCursor : pageInfo.previousCursor;
    const previousCursor =
      nextPage > page
        ? pageInfo.cursor
        : this.pages.get(pageInfo.previousCursor).previousCursor;

    this.setState({ loading: true }, async () => {
      await onPageChange({ cursor, previousCursor });
      this.setState({ loading: false });
    });
  };

  getPaginationMetadata() {
    const { connection, pageSize } = this.props;

    if (!this.pages.has(connection.pageInfo.cursor)) {
      this.pages.set(connection.pageInfo.cursor, {
        page: this.pages.size,
        pageInfo: connection.pageInfo,
      });
    }

    const { page, pageInfo } = this.pages.get(connection.pageInfo.cursor);

    if (page === this.pages.size - 1) {
      return {
        page,
        count: pageInfo.hasNextPage
          ? (this.pages.size + 1) * pageSize
          : this.pages.size * pageSize,
      };
    }

    return {
      page,
      count: this.pages.size * pageSize,
    };
  }

  handleHeaderClick = sortByHeader => {
    if (this.props.onHeaderClick) {
      this.props.onHeaderClick(sortByHeader);
    }
  };

  render() {
    const {
      classes,
      pageSize,
      columnsSize,
      connection,
      renderRow,
      headers,
      sortByHeader,
      sortDirection,
    } = this.props;
    const { loading } = this.state;
    const { count, page } = this.getPaginationMetadata();

    return (
      <div>
        <div className={classes.tableWrapper}>
          <Table>
            {headers && (
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableCell key={`table-header-${header}`}>
                      <TableSortLabel
                        active={header === sortByHeader}
                        direction={sortDirection || 'desc'}
                        onClick={() => this.handleHeaderClick(header)}>
                        {header}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {connection.edges.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columnsSize}>
                    <em>No items for this page.</em>
                  </TableCell>
                </TableRow>
              ) : (
                connection.edges.map(renderRow)
              )}
            </TableBody>
          </Table>
        </div>
        {loading ? (
          <Table>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={columnsSize} className={classes.loading}>
                  <Spinner size={24} />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <TablePagination
            component="div"
            colSpan={columnsSize}
            count={count}
            labelDisplayedRows={Function.prototype}
            rowsPerPage={pageSize}
            rowsPerPageOptions={[pageSize]}
            page={page}
            onChangePage={this.handlePageChange}
          />
        )}
      </div>
    );
  }
}
