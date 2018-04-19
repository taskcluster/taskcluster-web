import { Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import { array, shape, func, bool } from 'prop-types';
import { memoizeWith, pipe, map, sort as rSort } from 'ramda';
import { withStyles } from 'material-ui/styles';
import { TableRow, TableCell } from 'material-ui/Table';
import Button from 'material-ui/Button';
import PencilIcon from 'mdi-react/PencilIcon';
import ConnectionDataTable from '../ConnectionDataTable';
import { VIEW_CLIENTS_PAGE_SIZE } from '../../utils/constants';
import { pageInfo } from '../../utils/prop-types';
import sort from '../../utils/sort';

const sorted = pipe(
  rSort((a, b) => sort(a.node.clientId, b.node.clientId)),
  map(({ node: { clientId } }) => clientId)
);

@withStyles(theme => ({
  iconButton: {
    '& svg': {
      transition: theme.transitions.create('fill'),
      fill: theme.palette.primary.light,
    },
    '&:hover svg': {
      fill: theme.palette.common.white,
    },
  },
  editWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}))
export default class ClientsTable extends Component {
  static propTypes = {
    clientsConnection: shape({
      edges: array,
      pageInfo,
    }).isRequired,
    onPageChange: func.isRequired,
    sortByLastUsed: bool.isRequired,
  };

  createSortedClientsConnection = memoizeWith(
    (sortByLastUsed, clientsConnection) => {
      const ids = sorted(clientsConnection.edges);

      return `${ids.join('-')}-${sortByLastUsed}`;
    },
    (sortByLastUsed, clientsConnection) => {
      if (!sortByLastUsed) {
        return clientsConnection;
      }

      return {
        ...clientsConnection,
        edges: [...clientsConnection.edges].sort((a, b) =>
          sort(a.node.lastDateUsed, b.node.lastDateUsed)
        ),
      };
    }
  );

  render() {
    const {
      classes,
      onPageChange,
      sortByLastUsed,
      clientsConnection,
    } = this.props;

    return (
      <Fragment>
        <ConnectionDataTable
          connection={this.createSortedClientsConnection(
            sortByLastUsed,
            clientsConnection
          )}
          pageSize={VIEW_CLIENTS_PAGE_SIZE}
          columnsSize={1}
          onPageChange={onPageChange}
          renderRow={({ node: client }) => (
            <TableRow key={client.clientId}>
              <TableCell>{client.clientId}</TableCell>
              <TableCell>
                <div className={classes.editWrapper}>
                  <Button
                    size="small"
                    className={classes.iconButton}
                    component={Link}
                    to={`/auth/clients/${encodeURIComponent(client.clientId)}`}>
                    <PencilIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
        />
      </Fragment>
    );
  }
}
