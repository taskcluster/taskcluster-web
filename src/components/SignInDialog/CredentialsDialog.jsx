import { Component } from 'react';
import { func } from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

export default class CredentialsDialog extends Component {
  static propTypes = {
    onSignIn: func.isRequired,
  };

  state = {
    isValid: true,
    clientId: '',
    accessToken: '',
    certificate: '',
  };

  handleFieldChange = e => {
    let { isValid } = this.state;

    try {
      if (e.target.name === 'certificate') {
        JSON.parse(e.target.value);
        isValid = true;
      }
    } catch (err) {
      isValid = false;
    }

    this.setState({
      [e.target.name]: e.target.value,
      isValid,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { isValid, ...credentials } = this.state;

    if (isValid) {
      this.props.onSignIn(credentials);
    }
  };

  render() {
    const { onSignIn, ...props } = this.props;
    const { isValid, clientId, accessToken, certificate } = this.state;

    return (
      <Dialog {...props} aria-labelledby="credentials-dialog-title">
        <form onSubmit={this.handleSubmit} aria-disabled={!isValid}>
          <DialogTitle id="credentials-dialog-title">
            Sign in with credentials
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <em>Note: Credentials are not checked for validity.</em>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              name="clientId"
              label="Client ID"
              value={clientId}
              onChange={this.handleFieldChange}
              required
              fullWidth
            />
            <TextField
              margin="dense"
              name="accessToken"
              label="Access Token"
              value={accessToken}
              onChange={this.handleFieldChange}
              required
              fullWidth
            />
            <TextField
              name="certificate"
              label="JSON Certificate"
              value={certificate}
              onChange={this.handleFieldChange}
              error={!isValid}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>Cancel</Button>
            <Button
              color="secondary"
              variant="raised"
              disabled={!isValid}
              type="submit">
              Sign In
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}
