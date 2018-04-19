import { Component } from 'react';
import { arrayOf, func, number, string, oneOf, object } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableSortLabel,
  TableRow,
} from 'material-ui/Table';

@withStyles({
  tableWrapper: {
    overflowX: 'auto',
  },
})
/**
 * A table to display a set of data elements.
 */
export default class DataTable extends Component {
  static propTypes = {
    /**
     * The number of columns the table contains.
     * */
    columnsSize: number,
    /**
     * A function to execute for each row to render in the table.
     * Will be passed a datum from the table data. The function
     * should return the JSX necessary to render the given row.
     */
    renderRow: func,
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
    /**
     * A list of objects to display. Each element in the list is represented
     * by a row and each element's key-value pair represents a column.
     */
    tableData: arrayOf(object).isRequired,
  };

  static defaultProps = {
    sortByHeader: null,
    sortDirection: 'desc',
  };

  handleHeaderClick = sortByHeader => {
    if (this.props.onHeaderClick) {
      this.props.onHeaderClick(sortByHeader);
    }
  };

  render() {
    const {
      tableData,
      columnsSize,
      renderRow,
      headers,
      sortByHeader,
      sortDirection,
      classes,
    } = this.props;

    return (
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
            {tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnsSize}>
                  <em>No items for this page.</em>
                </TableCell>
              </TableRow>
            ) : (
              tableData.map(renderRow)
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
}
