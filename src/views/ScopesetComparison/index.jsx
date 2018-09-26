import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { equals } from 'ramda';
import { scopeUnion, scopeIntersection } from 'taskcluster-lib-scopes';
import classNames from 'classnames';
import CodeEditor from '@mozilla-frontend-infra/components/CodeEditor';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ScaleBalanceIcon from 'mdi-react/ScaleBalanceIcon';
import Dashboard from '../../components/Dashboard/index';
import Button from '../../components/Button';
import splitLines from '../../utils/splitLines';

@hot(module)
@withStyles(theme => ({
  actionButton: {
    ...theme.mixins.fab,
  },
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
  inputWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'left',
  },
  inputList: {
    flex: 1,
  },
  tableCell: {
    width: '50%',
  },
}))
export default class ScopesetComparison extends Component {
  state = {
    scopeTextA: '',
    scopeTextB: '',
  };

  handleScopesAChange = scopeTextA => {
    this.setState({ scopeTextA });
  };

  handleScopesBChange = scopeTextB => {
    this.setState({ scopeTextB });
  };

  handleCompareScopesClick = async () => {
    const { scopeTextA, scopeTextB } = this.state;

    if (scopeTextA && scopeTextB) {
      const scopesA = splitLines(scopeTextA);
      const scopesB = splitLines(scopeTextB);
      const scopesetDiff = this.getScopesetDiff(scopesA, scopesB);
      const cellColor = this.getCellColors(scopesetDiff);

      this.setState({ scopesetDiff, cellColor });
    }
  };

  getScopesetDiff = (scopesA, scopesB) => {
    const scopesUnion = scopeUnion(scopesA, scopesB);
    const scopesetDiff = [];

    scopesUnion.forEach(scope => {
      const s1 = scopeIntersection([scope], scopesA);
      const s2 = scopeIntersection([scope], scopesB);

      scopesetDiff.push([s1, s2]);
    });

    return scopesetDiff;
  };

  getCellColors = scopesetDiff => {
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
  };

  render() {
    const { classes } = this.props;
    const { scopeTextA, scopeTextB, scopesetDiff, cellColor } = this.state;

    return (
      <Dashboard title="Compare Scopesets">
        <Fragment>
          <div className={classes.inputWrapper}>
            <List className={classes.inputList}>
              <ListItem>
                <ListItemText primary="A:" />
                <CodeEditor
                  className={classes.editor}
                  onChange={this.handleScopesAChange}
                  placeholder="new-scope:for-something:*"
                  mode="scopemode"
                  value={scopeTextA}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="B:" />
                <CodeEditor
                  className={classes.editor}
                  onChange={this.handleScopesBChange}
                  placeholder="new-scope:for-something:*"
                  mode="scopemode"
                  value={scopeTextB}
                />
              </ListItem>
            </List>
          </div>
          {scopesetDiff &&
            cellColor && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>A</TableCell>
                    <TableCell>B</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scopesetDiff.map((scopes, index) => (
                    <TableRow key={scopes}>
                      <TableCell
                        className={classNames(
                          classes[cellColor[index][0]],
                          classes.tableCell
                        )}>
                        <List dense>
                          {scopes[0].length > 0 &&
                            scopes[0].map(scope => (
                              <ListItem key={scope}>
                                <ListItemText
                                  secondary={<code>{scope}</code>}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </TableCell>
                      <TableCell
                        className={classNames(
                          classes[cellColor[index][1]],
                          classes.tableCell
                        )}>
                        <List dense>
                          {scopes[1].length > 0 &&
                            scopes[1].map(scope => (
                              <ListItem key={scope}>
                                <ListItemText
                                  secondary={<code>{scope}</code>}
                                />
                              </ListItem>
                            ))}
                        </List>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

          <Tooltip title="Compare Scopes">
            <div className={classes.actionButton}>
              <Button
                color="secondary"
                variant="fab"
                onClick={this.handleCompareScopesClick}>
                <ScaleBalanceIcon />
              </Button>
            </div>
          </Tooltip>
        </Fragment>
      </Dashboard>
    );
  }
}
