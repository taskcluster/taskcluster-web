import { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  arrayOf,
  instanceOf,
  number,
  oneOf,
  oneOfType,
  shape,
  string,
} from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
// import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import LinkIcon from 'mdi-react/LinkIcon';
// import SkipNextIcon from 'mdi-react/SkipNextIcon';
// import SkipPreviousIcon from 'mdi-react/SkipPreviousIcon';
import DateDistance from '../DateDistance';
import Label from '../Label';

export const labels = {
  RUNNING: 'info',
  PENDING: 'default',
  UNSCHEDULED: 'default',
  COMPLETED: 'success',
  FAILED: 'error',
  EXCEPTION: 'warning',
};

@withStyles(theme => ({
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
export default class TaskDetailsCard extends Component {
  static propTypes = {
    task: shape({
      metadata: shape({
        name: string,
        description: string,
        owner: string,
        source: string,
      }),
      status: shape({
        state: oneOf([
          'RUNNING',
          'PENDING',
          'UNSCHEDULED',
          'COMPLETED',
          'FAILED',
          'EXCEPTION',
        ]),
        retriesLeft: number,
      }),
      retries: number,
      created: oneOfType([string, instanceOf(Date)]),
      deadline: oneOfType([string, instanceOf(Date)]),
      expires: oneOfType([string, instanceOf(Date)]),
      priority: string,
      provisionerId: string,
      workerType: string,
      schedulerId: string,
      dependencies: arrayOf(string),
    }).isRequired,
  };

  render() {
    const { classes, task } = this.props;
    const isExternal = task.metadata.source.startsWith('https://');

    return (
      <Card raised>
        <div>
          <CardContent classes={{ root: classes.cardContent }}>
            <Typography variant="headline" className={classes.headline}>
              Task Details
            </Typography>

            <List>
              <ListItem
                button
                component={isExternal ? 'a' : Link}
                to={isExternal ? null : task.metadata.source}
                href={isExternal ? task.metadata.source : null}
                target={isExternal ? '_blank' : null}
                rel={isExternal ? 'noopener noreferrer' : null}>
                <ListItemText
                  primary="Source"
                  secondary={task.metadata.source}
                />
                <LinkIcon />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="State"
                  secondary={
                    <Label mini status={labels[task.status.state]}>
                      {task.status.state}
                    </Label>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Retries Left"
                  secondary={`${task.status.retriesLeft} of ${task.retries}`}
                />
              </ListItem>
              <ListItem button>
                <ListItemText
                  primary="Created"
                  secondary={<DateDistance from={task.created} />}
                />
                <ContentCopyIcon />
              </ListItem>
              <ListItem button>
                <ListItemText
                  primary="Deadline"
                  secondary={
                    <DateDistance from={task.deadline} offset={task.created} />
                  }
                />
                <ContentCopyIcon />
              </ListItem>
              <ListItem button>
                <ListItemText
                  primary="Expires"
                  secondary={<DateDistance from={task.expires} />}
                />
                <ContentCopyIcon />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Priority"
                  secondary={
                    <Label mini status="info">
                      {task.priority}
                    </Label>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Provisioner"
                  secondary={task.provisionerId}
                />
              </ListItem>
              <ListItem
                button
                component={Link}
                to={`/provisioners/${task.provisionerId}/worker-types/${
                  task.workerType
                }`}>
                <ListItemText
                  primary="Worker Type"
                  secondary={task.workerType}
                />
                <LinkIcon />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Scheduler ID"
                  secondary={task.schedulerId}
                />
              </ListItem>
            </List>
          </CardContent>
        </div>
      </Card>
    );
  }
}
