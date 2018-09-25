import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import CodeEditor from '@mozilla-frontend-infra/components/CodeEditor';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ArrowExpandVerticalIcon from 'mdi-react/ArrowExpandVerticalIcon';
import CompareIcon from 'mdi-react/CompareIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import DeleteIcon from 'mdi-react/DeleteIcon';
import LinkIcon from 'mdi-react/LinkIcon';
import Dashboard from '../../components/Dashboard/index';
import Button from '../../components/Button';
import splitLines from '../../utils/splitLines';
import scopesetQuery from './scopeset.graphql';
import ScopesetDiff from '../../components/ScopesetDiff';

@hot(module)
@withStyles(theme => ({
  iconButton: {
    '& svg': {
      fill: theme.palette.text.primary,
    },
    marginRight: -theme.spacing.triple,
    [theme.breakpoints.down('sm')]: {
      marginRight: -14,
    },
  },
  actionButton: {
    ...theme.mixins.fab,
  },
  editor: {
    marginBottom: theme.spacing.double,
  },
  title: {
    marginBottom: theme.spacing.double,
  },
  listItemButton: {
    ...theme.mixins.listItemButton,
  },
  inputWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'left',
  },
  inputList: {
    flex: 1,
  },
}))
export default class ScopesetExpander extends Component {
  state = {
    scopeText: '',
    addScopeset: false,
  };

  handleExpandScopesClick = async () => {
    const scopes = splitLines(this.state.scopeText);

    this.setState({ scopes });
  };

  handleScopesChange = scopeText => {
    this.setState({ scopeText });
  };

  handleScopesBChange = scopeTextB => {
    this.setState({ scopeTextB });
  };

  handleAddScopesetClick = value => {
    this.setState({ addScopeset: value });
  };

  handleCompareScopesetsClick = () => {
    const scopes = splitLines(this.state.scopeText);
    const scopesB = splitLines(this.state.scopeTextB);

    this.setState({ scopes, scopesB });
  };

  render() {
    const { classes } = this.props;
    const { scopes, scopeText, scopesB, scopeTextB, addScopeset } = this.state;

    return (
      <Dashboard title="Expand Scopesets">
        <Fragment>
          <div className={classes.inputWrapper}>
            <List className={classes.inputList}>
              <ListItem>
                <CodeEditor
                  className={classes.editor}
                  onChange={this.handleScopesChange}
                  placeholder="new-scope:for-something:*"
                  mode="scopemode"
                  value={scopeText}
                />
                <Tooltip title="Add Scopeset">
                  <IconButton
                    className={classes.iconButton}
                    disabled={addScopeset}
                    onClick={() => this.handleAddScopesetClick(true)}>
                    <PlusIcon />
                  </IconButton>
                </Tooltip>
              </ListItem>
              {addScopeset && (
                <ListItem>
                  <CodeEditor
                    className={classes.editor}
                    onChange={this.handleScopesBChange}
                    placeholder="new-scope:for-something:*"
                    mode="scopemode"
                    value={scopeTextB}
                  />
                  <Tooltip title="Remove Scopeset">
                    <IconButton
                      className={classes.iconButton}
                      onClick={() => this.handleAddScopesetClick(false)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
              )}
            </List>
          </div>
          {scopes &&
            !addScopeset && (
              <Query query={scopesetQuery} variables={{ scopes }}>
                {({ loading, error, data: { expandScopes } }) => (
                  <List dense>
                    {loading && (
                      <ListItem>
                        <Spinner />
                      </ListItem>
                    )}
                    {error &&
                      error.graphQLErrors && (
                        <ListItem>
                          <ErrorPanel error={error} />
                        </ListItem>
                      )}
                    {expandScopes &&
                      expandScopes.map(scope => (
                        <ListItem
                          key={scope}
                          button
                          component={Link}
                          to={`/auth/scopes/${encodeURIComponent(scope)}`}
                          className={classes.listItemButton}>
                          <ListItemText secondary={<code>{scope}</code>} />
                          <LinkIcon size={16} />
                        </ListItem>
                      ))}
                  </List>
                )}
              </Query>
            )}
          {scopes &&
            scopesB &&
            addScopeset && (
              <ScopesetDiff scopesetA={scopes} scopesetB={scopesB} />
            )}
          {addScopeset ? (
            <Tooltip title="Compare Scopesets">
              <div className={classes.actionButton}>
                <Button
                  color="secondary"
                  variant="fab"
                  onClick={this.handleCompareScopesetsClick}>
                  <CompareIcon />
                </Button>
              </div>
            </Tooltip>
          ) : (
            <Tooltip title="Expand Scopes">
              <div className={classes.actionButton}>
                <Button
                  color="secondary"
                  variant="fab"
                  onClick={this.handleExpandScopesClick}>
                  <ArrowExpandVerticalIcon />
                </Button>
              </div>
            </Tooltip>
          )}
        </Fragment>
      </Dashboard>
    );
  }
}
