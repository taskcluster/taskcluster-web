import { Component, Fragment } from 'react';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import DialogAction from '../DialogAction';
import QuarantineButton from '../QuarantineButton';
import { worker } from '../../utils/prop-types';

@withStyles(theme => ({
  actionButton: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  headline: {
    paddingLeft: theme.spacing.triple,
    paddingRight: theme.spacing.triple,
  },
  cardContent: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: theme.spacing.double,
    paddingBottom: theme.spacing.double,
    '&:last-child': {
      paddingBottom: theme.spacing.triple,
    },
  },
}))
/**
 * Render information in a card layout about a worker.
 */
export default class WorkerDetailsCard extends Component {
  static propTypes = {
    /** A GraphQL worker response. */
    worker,
  };

  static defaultProps = {
    worker: null,
  };

  state = {
    actionExecuting: false,
  };

  // TODO: Delete after we have a better way to attach credentials to requests
  sleep(time) {
    return new Promise(resolve => {
      window.setTimeout(() => resolve(), time);
    });
  }

  // TODO: Delete after we have a better way to attach credentials to requests
  async mockRequest() {
    await this.sleep(2000);
    this.setState({ actionExecuting: false });
  }

  // TODO: Add action request
  handleActionClick = async (/* action */) => {
    // const { worker } = this.props;
    // const url = action.url
    //   .replace('<provisionerId>', worker.provisionerId)
    //   .replace('<workerType>', worker.workerType)
    //   .replace('<workerGroup>', worker.workerGroup)
    //   .replace('<workerId>', worker.workerId);

    this.setState({ actionExecuting: true });

    // TODO: Delete after we have a better way to attach credentials to requests
    await this.mockRequest();
  };

  // TODO: Add action request then show updated worker
  handleQuarantineClick = () => {};

  render() {
    const { classes, worker } = this.props;
    const { actionExecuting } = this.state;

    return (
      <Card raised>
        <CardContent classes={{ root: classes.cardContent }}>
          <Typography variant="headline" className={classes.headline}>
            Worker Details
          </Typography>

          <List>
            <ListItem>
              <ListItemText
                primary="First Claim"
                secondary="about 12 hours ago"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Actions"
                secondary={
                  <Fragment>
                    <QuarantineButton
                      quarantineUntil={worker.quarantineUntil}
                      onQuarantineClick={this.handleQuarantineClick}
                      disabled={actionExecuting}
                      size="small"
                      className={classes.actionButton}
                      variant="raised"
                    />
                    {worker.actions.map(action => (
                      <DialogAction
                        key={action.title}
                        tooltipProps={{
                          id: `${action.title}-tooltip`,
                          title: action.description,
                        }}
                        disabled={actionExecuting}
                        size="small"
                        variant="raised"
                        className={classes.actionButton}
                        title={`${action.title}?`}
                        body={action.description}
                        confirmText={action.title}
                        onActionClick={() => this.handleActionClick(action)}>
                        {action.title}
                      </DialogAction>
                    ))}
                  </Fragment>
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }
}
