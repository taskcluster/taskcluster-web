import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { bool } from 'prop-types';
import { addYears } from 'date-fns';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Switch from 'material-ui/Switch';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import ContentSaveIcon from 'mdi-react/ContentSaveIcon';
import LinkIcon from 'mdi-react/LinkIcon';
import LockResetIcon from 'mdi-react/LockResetIcon';
import SpeedDial from '../SpeedDial';
import DateChooser from '../DateChooser';
import { client } from '../../utils/prop-types';
// import splitLines from '../../utils/splitLines';

@withStyles(theme => ({
  saveButton: {
    position: 'fixed',
    bottom: theme.spacing.double,
    right: theme.spacing.triple,
  },
  expandedScopesListItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  expandedScopesWrapper: {
    paddingRight: 0,
  },
  listItemButton: {
    ...theme.mixins.listItemButton,
  },
}))
/** A form to view/edit/create a client */
export default class ClientForm extends Component {
  static propTypes = {
    /** A GraphQL client response. Not needed when creating a new client  */
    client,
    /** Set to `true` when creating a new client. */
    newClient: bool,
  };

  static defaultProps = {
    newClient: false,
    client: null,
  };

  state = {
    description: '',
    scopeText: '',
    clientId: '',
    created: null,
    lastModified: null,
    lastDateUsed: null,
    lastRotated: null,
    expires: null,
    deleteOnExpiration: true,
    expandedScopes: null,
  };

  static getDerivedStateFromProps({ newClient, client }) {
    if (newClient) {
      return null;
    }

    return {
      description: client.description,
      clientId: client.clientId,
      created: client.created,
      lastModified: client.lastModified,
      lastDateUsed: client.lastDateUsed,
      lastRotated: client.lastRotated,
      expires: client.expires,
      deleteOnExpiration: client.deleteOnExpiration,
      scopeText: client.scopes.join('\n'),
      expandedScopes: client.expandedScopes,
    };
  }

  handleInputChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleExpirationChange = expires => {
    this.setState({
      expires,
    });
  };

  handleDeleteOnExpirationChange = () => {
    this.setState({ deleteOnExpiration: !this.state.deleteOnExpiration });
  };

  // TODO: Reset accessToken
  handleResetAccessToken = () => {};

  // TODO: Handle save client request
  handleSaveClient = () => {
    // const { scopeText } = this.state;
    // const scopes = splitLines(scopeText);
  };

  render() {
    const { client, classes, newClient } = this.props;
    const {
      description,
      scopeText,
      clientId,
      created,
      lastModified,
      lastDateUsed,
      lastRotated,
      expires,
      deleteOnExpiration,
      expandedScopes,
    } = this.state;

    return (
      <Fragment>
        <List>
          <ListItem>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={deleteOnExpiration}
                    onChange={this.handleDeleteOnExpirationChange}
                  />
                }
                label="Delete on Expiration"
              />
            </FormGroup>
          </ListItem>
          {client && (
            <Fragment>
              <ListItem>
                <ListItemText primary="Client ID" secondary={clientId} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Created" secondary={created} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Modified"
                  secondary={lastModified}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Date Used"
                  secondary={lastDateUsed}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Last Rotated" secondary={lastRotated} />
              </ListItem>
            </Fragment>
          )}
          <ListItem>
            <ListItemText
              disableTypography
              primary={
                <Typography component="h3" variant="subheading">
                  Expires
                </Typography>
              }
              secondary={
                <DateChooser
                  value={newClient ? addYears(new Date(), 1000) : expires}
                  onChange={this.handleExpirationChange}
                  format="DD/MM/YYYY"
                  maxDate={addYears(new Date(), 1001)}
                />
              }
            />
          </ListItem>
          <ListItem>
            <TextField
              label="Description"
              name="description"
              onChange={this.handleInputChange}
              fullWidth
              multiline
              rows={5}
              value={description}
            />
          </ListItem>
          <ListItem>
            <TextField
              label="Scopes"
              name="scopeText"
              onChange={this.handleInputChange}
              fullWidth
              multiline
              rows={5}
              placeholder={newClient ? 'new-scope:for-something:*' : null}
              value={scopeText}
            />
          </ListItem>
          {client && expandedScopes.length ? (
            <Fragment>
              <ListItem>
                <ListItemText
                  primary="Expanded Scopes"
                  secondary={
                    <span>
                      Expanded scopes are determined from the client scopes,
                      expanding roles for scopes beginning with{' '}
                      <code>assume:</code>.
                    </span>
                  }
                />
              </ListItem>
              <ListItem classes={{ root: classes.expandedScopesListItem }}>
                <ListItemText
                  disableTypography
                  className={classes.expandedScopesWrapper}
                  secondary={
                    <List dense>
                      {expandedScopes.map(scope => (
                        <ListItem
                          key={scope}
                          button
                          component={Link}
                          to={`/auth/scopes/${encodeURIComponent(scope)}`}
                          className={classes.listItemButton}>
                          <ListItemText secondary={<code>{scope}</code>} />
                          <LinkIcon />
                        </ListItem>
                      ))}
                    </List>
                  }
                />
              </ListItem>
            </Fragment>
          ) : null}
        </List>
        {newClient ? (
          <Tooltip title="Save">
            <Button
              variant="fab"
              color="secondary"
              onClick={this.handleSaveClient}
              className={classes.saveButton}>
              <ContentSaveIcon />
            </Button>
          </Tooltip>
        ) : (
          <SpeedDial>
            <SpeedDialAction
              icon={<ContentSaveIcon />}
              onClick={this.handleSaveClient}
              ButtonProps={{ color: 'secondary' }}
              tooltipTitle="Save"
            />
            <SpeedDialAction
              icon={<LockResetIcon />}
              onClick={this.handleResetAccessToken}
              ButtonProps={{ color: 'secondary' }}
              tooltipTitle="Reset Access Token"
            />
          </SpeedDial>
        )}
      </Fragment>
    );
  }
}
