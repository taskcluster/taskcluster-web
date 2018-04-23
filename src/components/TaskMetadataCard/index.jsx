import { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import LinkIcon from 'mdi-react/LinkIcon';
import Markdown from '../Markdown';
import { taskMetadata } from '../../utils/prop-types';

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
    maxWidth: 300,
    whiteSpace: 'nowrap',
  },
  card: {
    width: 400,
  },
  listItemButton: {
    ...theme.mixins.listItemButton,
  },
}))
/**
 * Render metadata information in a card layout about a task.
 */
export default class TaskMetadataCard extends Component {
  static propTypes = {
    /** Task metadata */
    metadata: taskMetadata.isRequired,
  };

  render() {
    const { classes, metadata } = this.props;
    const isExternal = metadata.source.startsWith('https://');

    return (
      <Card elevation={0} className={classes.card}>
        <CardContent classes={{ root: classes.cardContent }}>
          <Typography variant="headline" className={classes.headline}>
            {metadata.name}
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Description"
                secondary={<Markdown>{metadata.description}</Markdown>}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Owner" secondary={metadata.owner} />
            </ListItem>
            <ListItem
              button
              className={classes.listItemButton}
              component={isExternal ? 'a' : Link}
              to={isExternal ? null : metadata.source}
              href={isExternal ? metadata.source : null}
              target={isExternal ? '_blank' : null}
              rel={isExternal ? 'noopener noreferrer' : null}>
              <ListItemText
                classes={{ secondary: classes.sourceHeadline }}
                primary="Source"
                secondary={metadata.source}
              />
              {isExternal ? <OpenInNewIcon /> : <LinkIcon />}
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  }
}
