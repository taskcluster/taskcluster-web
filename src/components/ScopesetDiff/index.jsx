import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import scopeUtils from 'taskcluster-lib-scopes';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { equals } from 'ramda';

@withStyles(theme => ({
  listItemButton: {
    ...theme.mixins.listItemButton,
  },
  redCell: {
    backgroundColor: 'rgba(255, 0, 0, 0.25)',
  },
  greenCell: {
    backgroundColor: 'rgba(0, 255, 0, 0.25)',
  },
  yellowCell: {
    backgroundColor: 'rgba(255, 255, 0, 0.25)',
  },
}))
export default class ScopesetDiff extends Component {
  getScopesetDiff() {
    const { scopesetA, scopesetB } = this.props;
    const scopesUnion = scopeUtils.scopeUnion(scopesetA, scopesetB);
    const scopesetDiff = [];

    scopesUnion.forEach(scope => {
      const s1 = scopeUtils.scopeIntersection([scope], scopesetA);
      const s2 = scopeUtils.scopeIntersection([scope], scopesetB);

      scopesetDiff.push([s1, s2]);
    });

    return scopesetDiff;
  }

  getCellColors(scopesetDiff) {
    const cellColor = [];

    scopesetDiff.forEach(scope => {
      if (scope[0].length === 0 && scope[1].length) {
        cellColor.push(['', 'greenCell']);
      } else if (scope[0].length && scope[1].length === 0) {
        cellColor.push(['redCell', '']);
      } else if (!equals(scope[0], scope[1])) {
        cellColor.push(['yellowCell', 'yellowCell']);
      } else {
        cellColor.push(['', '']);
      }
    });

    return cellColor;
  }

  render() {
    const scopesetDiff = this.getScopesetDiff();
    const cellColor = this.getCellColors(scopesetDiff);
    const { classes } = this.props;

    return (
      <Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Scopeset A</TableCell>
              <TableCell>Scopeset B</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scopesetDiff.map((scopes, index) => (
              <TableRow key={scopes}>
                <TableCell className={classes[cellColor[index][0]]}>
                  <List dense>
                    {scopes[0].length > 0 &&
                      scopes[0].map(scope => (
                        <ListItem key={scope}>
                          <ListItemText secondary={<code>{scope}</code>} />
                        </ListItem>
                      ))}
                  </List>
                </TableCell>
                <TableCell className={classes[cellColor[index][1]]}>
                  <List dense>
                    {scopes[1].length > 0 &&
                      scopes[1].map(scope => (
                        <ListItem key={scope}>
                          <ListItemText secondary={<code>{scope}</code>} />
                        </ListItem>
                      ))}
                  </List>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Fragment>
    );
  }
}
