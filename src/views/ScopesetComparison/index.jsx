import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { equals } from 'ramda';
import { scopeUnion, scopeIntersection } from 'taskcluster-lib-scopes';
import CodeEditor from '@mozilla-frontend-infra/components/CodeEditor';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
  editorGrid: {
    marginBottom: theme.spacing.unit,
  },
  cellGrid: {
    padding: theme.spacing.unit,
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
      const cellColors = this.getCellColors(scopesetDiff);

      this.setState({ scopesetDiff, cellColors });
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
    const cellColors = [];
    const CELLS = {
      G: 'green',
      R: 'red',
      Y: 'yellow',
    };

    scopesetDiff.forEach(scope => {
      if (scope[0].length === 0 && scope[1].length) {
        cellColors.push(['', `${CELLS.G}Cell`]);
      } else if (scope[0].length && scope[1].length === 0) {
        cellColors.push([`${CELLS.R}Cell`, '']);
      } else if (!equals(scope[0], scope[1])) {
        cellColors.push([`${CELLS.Y}Cell`, `${CELLS.Y}Cell`]);
      } else {
        cellColors.push(['', '']);
      }
    });

    return cellColors;
  };

  render() {
    const { classes } = this.props;
    const { scopeTextA, scopeTextB, scopesetDiff, cellColors } = this.state;

    return (
      <Dashboard title="Compare Scopesets">
        <Fragment>
          <Grid className={classes.editorGrid} container spacing={16}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom variant="subheading">
                Scope A
              </Typography>
              <CodeEditor
                className={classes.editor}
                onChange={this.handleScopesAChange}
                placeholder="new-scope:for-something:*"
                mode="scopemode"
                value={scopeTextA}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom variant="subheading">
                Scope B
              </Typography>
              <CodeEditor
                className={classes.editor}
                onChange={this.handleScopesBChange}
                placeholder="new-scope:for-something:*"
                mode="scopemode"
                value={scopeTextB}
              />
            </Grid>
          </Grid>
          {scopesetDiff &&
            cellColors && (
              <Fragment>
                {scopesetDiff.map((scopes, index) => (
                  <Grid key={scopes} container>
                    <Grid item xs={6} className={classes[cellColors[index][0]]}>
                      {scopes[0].length > 0 &&
                        scopes[0].map(scope => (
                          <Typography
                            key={scope}
                            variant="body2"
                            className={classes.cellGrid}>
                            {scope}
                          </Typography>
                        ))}
                    </Grid>
                    <Grid item xs={6} className={classes[cellColors[index][1]]}>
                      {scopes[1].length > 0 &&
                        scopes[1].map(scope => (
                          <Typography
                            key={scope}
                            variant="body2"
                            className={classes.cellGrid}>
                            {scope}
                          </Typography>
                        ))}
                    </Grid>
                  </Grid>
                ))}
              </Fragment>
            )}

          <Tooltip title="Compare Scopes">
            <Button
              color="secondary"
              variant="fab"
              onClick={this.handleCompareScopesClick}
              className={classes.actionButton}>
              <ScaleBalanceIcon />
            </Button>
          </Tooltip>
        </Fragment>
      </Dashboard>
    );
  }
}
