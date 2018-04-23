import { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import HammerIcon from 'mdi-react/HammerIcon';
import SpeedDialActionDialog from '../SpeedDialActionDialog';
import SpeedDial from '../SpeedDial';
import QuarantineSpeedDialAction from '../QuarantineSpeedDialAction';
import { worker } from '../../utils/prop-types';
import sleep from '../../utils/sleep';

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
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing.double,
    top: 12 * theme.spacing.unit,
    right: theme.spacing.double,
    flexDirection: 'column',
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

  // TODO: Delete after we have a better way to attach credentials to requests
  async mockRequest() {
    await sleep(2000);
  }

  // TODO: Add action request
  handleActionClick = async (/* action */) => {
    // const { worker } = this.props;
    // const url = action.url
    //   .replace('<provisionerId>', worker.provisionerId)
    //   .replace('<workerType>', worker.workerType)
    //   .replace('<workerGroup>', worker.workerGroup)
    //   .replace('<workerId>', worker.workerId);

    // TODO: Delete after we have a better way to attach credentials to requests
    await this.mockRequest();
  };

  // TODO: Add action request then show updated worker
  handleQuarantineClick = () => {};

  render() {
    const { classes, worker } = this.props;

    return (
      <div>
        <List>
          <ListItem>
            <ListItemText
              primary="First Claim"
              secondary="about 12 hours ago"
            />
          </ListItem>
        </List>
        <SpeedDial className={classes.speedDial}>
          <QuarantineSpeedDialAction
            quarantineUntil={worker.quarantineUntil}
            onQuarantineClick={this.handleQuarantineClick}
          />
          {worker.actions.map(action => (
            <SpeedDialActionDialog
              key={action.title}
              title={`${action.title}?`}
              icon={<HammerIcon />}
              body={action.description}
              confirmText={action.title}
              onActionClick={this.handleActionClick}
              tooltipTitle={
                <div>
                  <div>{action.title}</div>
                  <div>{action.description}</div>
                </div>
              }
            />
          ))}
        </SpeedDial>
      </div>
    );
  }
}
