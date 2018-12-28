import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { oneOf, object, string } from 'prop-types';
import { upperCase } from 'change-case';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import DataTable from '../../../components/DataTable';
import Markdown from '../../../components/Markdown';
import StatusLabel from '../../../components/StatusLabel';
import SchemaTable from '../../../components/SchemaTable';

const primaryTypographyProps = { variant: 'body1' };

@withStyles(
  theme => ({
    headline: {
      paddingLeft: theme.spacing.triple,
      paddingRight: theme.spacing.triple,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    collapseContainer: {
      display: 'none',
    },
    collapseEntered: {
      display: 'block',
    },
    expansionPanelSummaryContent: {
      display: 'flex',
      justifyContent: 'space-between',
      '& div:first-child': {
        flex: 1,
      },
      '& div:nth-child(2)': {
        flex: 1,
      },
    },
  }),
  { withTheme: true }
)
export default class Entry extends Component {
  static propTypes = {
    /** Entry type. */
    type: oneOf(['function', 'topic-exchange']).isRequired,
    /** The reference entry. */
    entry: object.isRequired,
    /** Required when `type` is `topic-exchange`. */
    exchangePrefix: string,
  };

  static defaultProps = {
    exchangePrefix: null,
  };

  getSignatureFromEntry(entry) {
    const parameters = entry.query.length
      ? entry.args.concat(`{${entry.query.join(', ')}}`)
      : entry.args;

    return `${entry.name}(${parameters.join(', ')}) : ${
      entry.output ? 'result' : 'void'
    }`;
  }

  renderFunctionExpansionPanelSummary = () => {
    const { entry, classes } = this.props;
    const signature = this.getSignatureFromEntry(entry);

    return (
      <Grid container spacing={8}>
        <Grid item xs={6}>
          <div>
            <Typography id={entry.name} component="h3">
              {signature}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <Typography>{entry.title}</Typography>
          </div>
        </Grid>
        <Grid item xs={2}>
          <div className={classes.statusLabel}>
            <StatusLabel state={upperCase(entry.stability)} />
          </div>
        </Grid>
      </Grid>
    );
  };

  renderExchangeExpansionPanelSummary = () => {
    const { entry } = this.props;

    return (
      <Grid container spacing={8}>
        <Grid item xs={5}>
          <div>
            <Typography id={entry.name} component="h3">
              {entry.exchange}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={7}>
          <div>
            <Typography>{entry.title}</Typography>
          </div>
        </Grid>
      </Grid>
    );
  };

  renderSchemaTable(schema, headerTitle) {
    return (
      <ListItem>
        <ListItemText
          primaryTypographyProps={primaryTypographyProps}
          primary={headerTitle}
          secondary={
            <Fragment>
              <br />
              <SchemaTable schema={schema} />
            </Fragment>
          }
        />
      </ListItem>
    );
  }

  renderFunctionExpansionDetails = () => {
    const { entry } = this.props;

    return (
      <List dense>
        <ListItem>
          <ListItemText
            primaryTypographyProps={primaryTypographyProps}
            primary="Method"
            secondary={<StatusLabel state={upperCase(entry.method)} />}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primaryTypographyProps={primaryTypographyProps}
            primary="Route"
            secondary={entry.route}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primaryTypographyProps={primaryTypographyProps}
            primary="Signature"
            secondary={entry.signature}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primaryTypographyProps={primaryTypographyProps}
            primary="Stability"
            secondary={<StatusLabel state={upperCase(entry.stability)} />}
          />
        </ListItem>
        {entry.description ? (
          <ListItem>
            <ListItemText
              primaryTypographyProps={primaryTypographyProps}
              primary="Description"
              secondary={<Markdown>{entry.description}</Markdown>}
            />
          </ListItem>
        ) : (
          <ListItem>
            <ListItemText
              primaryTypographyProps={primaryTypographyProps}
              primary="Description"
              secondary="n/a"
            />
          </ListItem>
        )}
        {entry.input && this.renderSchemaTable(entry.input, 'Request Payload')}
        {entry.output &&
          this.renderSchemaTable(entry.output, 'Response Payload')}
      </List>
    );
  };

  renderExchangeExpansionDetails = () => {
    const { entry, exchangePrefix } = this.props;
    const exchange = `${exchangePrefix}${entry.exchange}`;

    return (
      <List dense>
        <ListItem>
          <ListItemText
            primaryTypographyProps={primaryTypographyProps}
            primary="Exchange"
            secondary={exchange}
          />
        </ListItem>
        {entry.description ? (
          <ListItem>
            <ListItemText
              primaryTypographyProps={primaryTypographyProps}
              primary="Description"
              secondary={<Markdown>{entry.description}</Markdown>}
            />
          </ListItem>
        ) : (
          <ListItem>
            <ListItemText
              primaryTypographyProps={primaryTypographyProps}
              primary="Description"
              secondary="n/a"
            />
          </ListItem>
        )}
        {entry.input && this.renderSchemaTable(entry.input, 'Request Payload')}
        {entry.output &&
          this.renderSchemaTable(entry.output, 'Response Payload')}
        <ListItem>
          <ListItemText
            primaryTypographyProps={primaryTypographyProps}
            primary="Routing Keys"
            secondary={
              <DataTable
                headers={['Index', 'Name', 'Summary', '']}
                items={entry.routingKey}
                renderRow={(routingKey, idx) => (
                  <TableRow key={routingKey.name}>
                    <TableCell>
                      <Typography>{idx}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{routingKey.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Markdown>{routingKey.summary}</Markdown>
                    </TableCell>
                    <TableCell>
                      {routingKey.constant && 'constant-key'}
                      {routingKey.required && 'option-key'}
                      {routingKey.multipleWords && 'multi-key'}
                    </TableCell>
                  </TableRow>
                )}
              />
            }
          />
        </ListItem>
        {entry.schema &&
          this.renderSchemaTable(entry.schema, 'Message Payload')}
      </List>
    );
  };

  render() {
    const { classes, type } = this.props;
    const isEntryExchange = type === 'topic-exchange';

    return (
      <ExpansionPanel
        CollapseProps={{
          classes: {
            container: classes.collapseContainer,
            entered: classes.collapseEntered,
          },
        }}>
        <ExpansionPanelSummary
          classes={{
            content: classNames({
              [classes.expansionPanelSummaryContent]: !isEntryExchange,
            }),
          }}
          expandIcon={<ExpandMoreIcon />}>
          {isEntryExchange
            ? this.renderExchangeExpansionPanelSummary()
            : this.renderFunctionExpansionPanelSummary()}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {isEntryExchange
            ? this.renderExchangeExpansionDetails()
            : this.renderFunctionExpansionDetails()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
