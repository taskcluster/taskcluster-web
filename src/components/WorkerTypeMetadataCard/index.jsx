import { PureComponent } from 'react';
import { shape, string } from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Markdown from '../Markdown';

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
  sourceHeadline: {
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
  },
}))
/**
 * Render metadata information in a card layout about a worker type.
 */
export default class WorkerTypeMetadataCard extends PureComponent {
  static propTypes = {
    /** Worker Type metadata */
    metadata: shape({
      description: string,
    }).isRequired,
  };

  render() {
    const { classes, metadata } = this.props;

    return (
      <Card raised>
        <CardContent classes={{ root: classes.cardContent }}>
          <Typography variant="headline" className={classes.headline}>
            Worker Type Metadata
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Description"
                secondary={<Markdown>{metadata.description || '`-`'}</Markdown>}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }
}
