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
    expansionPanelSummary: {
      margin: 0,
    },
    list: {
      width: '100%',
    },
    routingKeyCell: {
      '& span:not(:first-child)': {
        marginLeft: theme.spacing.unit / 2,
      },
    },
    summaryCell: {
      whiteSpace: 'normal',
    },
    gridContainer: {
      '& > div': {
        margin: 'auto',
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

  state = {
    expanded: false,
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
      <Grid className={classes.gridContainer} container spacing={8}>
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
    const { entry, classes } = this.props;

    return (
      <Grid className={classes.gridContainer} container spacing={8}>
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
    const { classes, entry } = this.props;

    return (
      <List className={classes.list}>
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
    const { classes, entry, exchangePrefix } = this.props;
    const { expanded } = this.state;
    const exchange = `${exchangePrefix}${entry.exchange}`;

    return (
      expanded && (
        <List className={classes.list}>
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
          {entry.input &&
            this.renderSchemaTable(entry.input, 'Request Payload')}
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
                      <TableCell className={classes.summaryCell}>
                        <Markdown>{routingKey.summary}</Markdown>
                      </TableCell>
                      <TableCell className={classes.routingKeyCell}>
                        {routingKey.constant && (
                          <span
                            title={`This key always assume the value ${
                              routingKey.constant
                            }. Used to allow additional routing key formats.`}>
                            <StatusLabel state="CONSTANT_KEY" />
                          </span>
                        )}
                        {routingKey.required && (
                          <span title="This key takes the value of `_`, if it does not make sense for the event reported.">
                            <StatusLabel state="OPTION_KEY" />
                          </span>
                        )}
                        {routingKey.multipleWords && (
                          <span title="This key may container dots `.`, creating multiple sub-keys, match it with `#`">
                            <StatusLabel state="MULTI_KEY" />
                          </span>
                        )}
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
      )
    );
  };

  handlePanelChange = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  };

  render() {
    const { classes, type } = this.props;
    const isEntryExchange = type === 'topic-exchange';

    return (
      <ExpansionPanel
        onChange={this.handlePanelChange}
        CollapseProps={{
          classes: {
            container: classes.collapseContainer,
            entered: classes.collapseEntered,
          },
        }}>
        <ExpansionPanelSummary
          classes={{
            content: classNames(classes.expansionPanelSummary, {
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
