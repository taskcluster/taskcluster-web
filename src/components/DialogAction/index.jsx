import { PureComponent, Fragment } from 'react';
import { node, string, func, shape, number } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Tooltip from 'material-ui/Tooltip';
import { CircularProgress } from 'material-ui/Progress';
import ErrorPanel from '../ErrorPanel';

@withStyles({
  executingActionWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -12,
    marginTop: -12,
  },
})
/**
 * A button that displays a dialog when clicked.
 */
export default class DialogAction extends PureComponent {
  static propTypes = {
    /** The content of the button. */
    children: node.isRequired,
    /** The title of the Dialog. */
    title: node.isRequired,
    /** The body of the Dialog. */
    body: node.isRequired,
    /** The text content of the executing action button */
    confirmText: string.isRequired,
    /** The callback to trigger when the executing action button is clicked */
    onActionClick: func.isRequired,
    /** Properties applied to the Tooltip component. */
    tooltipProps: shape({
      title: node.isRequired,
      id: string.isRequired,
      placement: string,
      enterDelay: number,
    }),
  };

  static defaultProps = {
    tooltipProps: {
      enterDelay: 300,
      placement: 'bottom',
    },
  };

  state = {
    open: false,
    executing: false,
    error: null,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleActionClick = async () => {
    this.setState({ executing: true, error: null });

    try {
      await this.props.onActionClick();

      this.setState({ executing: false });
    } catch (error) {
      this.setState({
        executing: false,
        error,
      });
    }

    this.handleClose();
  };

  render() {
    const { open, executing, error } = this.state;
    const {
      children,
      title,
      body,
      confirmText,
      classes,
      className,
      tooltipProps,
      onActionClick: _,
      ...props
    } = this.props;

    return (
      <Fragment>
        <Tooltip {...tooltipProps}>
          <Button className={className} onClick={this.handleOpen} {...props}>
            {children}
          </Button>
        </Tooltip>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            {error && (
              <DialogContentText>
                <ErrorPanel error={error} />
              </DialogContentText>
            )}
            <DialogContentText>{body}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={executing}
              onClick={this.handleClose}
              color="secondary">
              Cancel
            </Button>
            <div className={classes.executingActionWrapper}>
              <Button
                disabled={executing}
                onClick={this.handleActionClick}
                color="secondary"
                autoFocus>
                {confirmText}
              </Button>
              {executing && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
