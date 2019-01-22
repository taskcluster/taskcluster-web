import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { func, number, string } from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Label from '@mozilla-frontend-infra/components/Label';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import MobileStepper from '@material-ui/core/MobileStepper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import ChevronUpIcon from 'mdi-react/ChevronUpIcon';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import ContentCopyIcon from 'mdi-react/ContentCopyIcon';
import LinkIcon from 'mdi-react/LinkIcon';
import LockIcon from 'mdi-react/LockIcon';
import LockOpenOutlineIcon from 'mdi-react/LockOpenOutlineIcon';
import OpenInNewIcon from 'mdi-react/OpenInNewIcon';
import Button from '../Button';
import AnchorOrLink from '../Markdown/AnchorOrLink';
import ConnectionDataTable from '../ConnectionDataTable';
import DateDistance from '../DateDistance';
import StatusLabel from '../StatusLabel';
import NoRunsIcon from './NoRunsIcon';
import { ARTIFACTS_PAGE_SIZE } from '../../utils/constants';
import { runs } from '../../utils/prop-types';

const DOTS_VARIANT_LIMIT = 5;

@withRouter
@withStyles(
  theme => ({
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
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
    listItemButton: {
      ...theme.mixins.listItemButton,
    },
    pointer: {
      cursor: 'pointer',
    },
    linkCell: {
      textAlign: 'right',
    },
    logButton: {
      marginRight: theme.spacing.unit,
    },
    artifactsListItemContainer: {
      display: 'block',
    },
    boxVariantIcon: {
      width: '25%',
      height: 'auto',
    },
    boxVariant: {
      textAlign: 'center',
    },
    boxVariantText: {
      color: fade(theme.palette.text.primary, 0.4),
    },
    listItemSecondaryAction: {
      paddingRight: theme.spacing.unit,
      display: 'flex',
      alignItems: 'center',
      '& button, & a': {
        ...theme.mixins.listItemButton,
      },
    },
    artifactLink: {
      textDecoration: 'none',
      width: '100%',
      display: 'block',
      height: '100%',
      verticalAlign: 'middle',
    },
    artifactTableRow: {
      height: 'auto',
    },
    artifactNameTableCell: {
      width: '100%',
    },
    artifactsTableCell: {
      padding: `${theme.spacing.unit}px ${theme.spacing.triple}px`,
    },
    artifactNameWrapper: {
      display: 'inline-flex',
    },
  }),
  { withTheme: true }
)
/**
 * Render a paginated card layout for the runs of a GraphQL task response.
 */
export default class TaskRunsCard extends Component {
  static propTypes = {
    /**
     * A collection of runs for a GraphQL task.
     */
    runs: runs.isRequired,
    /**
     * The worker type associated with the runs' task.
     */
    workerType: string.isRequired,
    /**
     * The provisioner ID associated with the runs' task.
     */
    provisionerId: string.isRequired,
    /**
     * The current selected run index to display in the card. Paging through
     * runs will trigger a history change, for which the `selectedRunId` can be
     * updated.
     */
    selectedRunId: number.isRequired,
    /**
     * Execute a function to load new artifacts when paging through them.
     */
    onArtifactsPageChange: func.isRequired,
  };

  state = {
    showArtifacts: false,
  };

  getCurrentRun() {
    return this.props.runs[this.props.selectedRunId];
  }

  getArtifactUrl = ({ url, isLog }) => {
    if (!url) {
      return '';
    }

    const { taskId, runId, state } = this.getCurrentRun();

    if (isLog) {
      const live = state === 'PENDING' || state === 'RUNNING';
      const encoded = encodeURIComponent(url);

      return live
        ? `/tasks/${taskId}/runs/${runId}/logs/live/${encoded}`
        : `/tasks/${taskId}/runs/${runId}/logs/${encoded}`;
    }

    return url;
  };

  handleNext = () => {
    const { history } = this.props;
    const { taskId, runId } = this.getCurrentRun();

    history.push(`/tasks/${taskId}/runs/${runId + 1}`);
  };

  handlePrevious = () => {
    const { history } = this.props;
    const { taskId, runId } = this.getCurrentRun();

    history.push(`/tasks/${taskId}/runs/${runId - 1}`);
  };

  handleToggleArtifacts = () => {
    this.setState({ showArtifacts: !this.state.showArtifacts });
  };

  getLiveLogArtifactFromRun = run => {
    const artifact = run.artifacts.edges.find(
      ({ node: { name } }) => name === 'public/logs/live.log'
    );

    if (!artifact) {
      return;
    }

    return artifact.node;
  };

  createSortedArtifactsConnection(artifacts) {
    return {
      ...artifacts,
      edges: [...artifacts.edges].sort((a, b) => {
        if (a.node.isPublic === b.node.isPublic) {
          return 0;
        }

        return a.node.isPublic ? -1 : 1;
      }),
    };
  }

  renderArtifactsTable() {
    const { classes, onArtifactsPageChange } = this.props;
    const run = this.getCurrentRun();
    const artifacts = this.createSortedArtifactsConnection(run.artifacts);

    return (
      <ConnectionDataTable
        connection={artifacts}
        pageSize={ARTIFACTS_PAGE_SIZE}
        columnsSize={3}
        onPageChange={onArtifactsPageChange}
        renderRow={({ node: artifact }) => (
          <TableRow
            key={`run-artifact-${run.taskId}-${run.runId}-${artifact.name}`}
            className={classNames(
              classes.listItemButton,
              classes.artifactTableRow,
              {
                [classes.pointer]: !!artifact.url,
              }
            )}
            hover={!!artifact.url}>
            <AnchorOrLink
              className={classes.artifactLink}
              href={this.getArtifactUrl(artifact)}>
              <TableCell className={classes.artifactsTableCell}>
                {artifact.isPublic && <LockOpenOutlineIcon />}
                {!artifact.isPublic && artifact.url && <LockIcon />}
              </TableCell>
              <TableCell
                className={classNames(
                  classes.artifactNameTableCell,
                  classes.artifactsTableCell
                )}>
                <div className={classes.artifactNameWrapper}>
                  {artifact.isLog && (
                    <Label status="info" mini className={classes.logButton}>
                      LOG
                    </Label>
                  )}
                  <Typography>{artifact.name}</Typography>
                </div>
              </TableCell>
              <TableCell
                className={classNames(
                  classes.linkCell,
                  classes.artifactsTableCell
                )}>
                {artifact.isPublic && <LinkIcon />}
                {!artifact.isPublic && artifact.url && <OpenInNewIcon />}
              </TableCell>
            </AnchorOrLink>
          </TableRow>
        )}
      />
    );
  }

  render() {
    const {
      classes,
      runs,
      selectedRunId,
      provisionerId,
      workerType,
      theme,
    } = this.props;
    const { showArtifacts } = this.state;
    const run = this.getCurrentRun();
    const liveLogArtifact = this.getLiveLogArtifactFromRun(run);

    return (
      <Card raised>
        <div>
          <CardContent classes={{ root: classes.cardContent }}>
            <Typography variant="h5" className={classes.headline}>
              Task Run {selectedRunId}
            </Typography>
            {run ? (
              <List>
                <ListItem>
                  <ListItemText
                    primary="State"
                    secondary={<StatusLabel state={run.state} />}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Reason Created"
                    secondary={<StatusLabel state={run.reasonCreated} />}
                  />
                </ListItem>
                <CopyToClipboard
                  title={`${run.scheduled} (Copy)`}
                  text={run.scheduled}>
                  <ListItem button className={classes.listItemButton}>
                    <ListItemText
                      primary="Scheduled"
                      secondary={<DateDistance from={run.scheduled} />}
                    />
                    <ContentCopyIcon />
                  </ListItem>
                </CopyToClipboard>
                <CopyToClipboard
                  title={`${run.started} (Copy)`}
                  text={run.started}>
                  <ListItem button className={classes.listItemButton}>
                    <ListItemText
                      primary="Started"
                      secondary={
                        run.started ? (
                          <DateDistance
                            from={run.started}
                            offset={run.scheduled}
                          />
                        ) : (
                          <em>n/a</em>
                        )
                      }
                    />
                    <ContentCopyIcon />
                  </ListItem>
                </CopyToClipboard>
                <CopyToClipboard
                  title={`${run.resolved} (Copy)`}
                  text={run.resolved}>
                  <ListItem button className={classes.listItemButton}>
                    <ListItemText
                      primary="Resolved"
                      secondary={
                        run.resolved ? (
                          <DateDistance
                            from={run.resolved}
                            offset={run.started}
                          />
                        ) : (
                          <em>n/a</em>
                        )
                      }
                    />
                    <ContentCopyIcon />
                  </ListItem>
                </CopyToClipboard>
                <ListItem>
                  <ListItemText
                    primary="Reason Resolved"
                    secondary={
                      run.reasonResolved ? (
                        <StatusLabel state={run.reasonResolved} />
                      ) : (
                        <em>n/a</em>
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Worker Group"
                    secondary={run.workerGroup || <em>n/a</em>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Worker ID" secondary={run.workerId} />
                  <ListItemSecondaryAction
                    className={classes.listItemSecondaryAction}>
                    <CopyToClipboard
                      title={`${run.workerId} (Copy)`}
                      text={run.workerId}>
                      <IconButton>
                        <ContentCopyIcon />
                      </IconButton>
                    </CopyToClipboard>
                    <IconButton
                      title="View Worker"
                      component={Link}
                      to={`/provisioners/${provisionerId}/worker-types/${workerType}/workers/${
                        run.workerId
                      }`}>
                      <LinkIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <CopyToClipboard
                  title={`${run.takenUntil} (Copy)`}
                  text={run.takenUntil}>
                  <ListItem button className={classes.listItemButton}>
                    <ListItemText
                      primary="Taken Until"
                      secondary={
                        run.takenUntil ? (
                          <DateDistance from={run.takenUntil} />
                        ) : (
                          <em>n/a</em>
                        )
                      }
                    />
                    <ContentCopyIcon />
                  </ListItem>
                </CopyToClipboard>
                {liveLogArtifact && (
                  <ListItem
                    button
                    className={classes.listItemButton}
                    component={Link}
                    to={this.getArtifactUrl(liveLogArtifact)}>
                    <ListItemText
                      primary="View Live Log"
                      secondary={liveLogArtifact.name}
                    />
                    <LinkIcon />
                  </ListItem>
                )}
                <ListItem
                  button
                  className={classes.listItemButton}
                  onClick={this.handleToggleArtifacts}>
                  <ListItemText primary="Artifacts" />
                  {showArtifacts ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </ListItem>
                <Collapse in={showArtifacts} timeout="auto">
                  <List component="div" disablePadding>
                    <ListItem
                      className={classes.artifactsListItemContainer}
                      component="div"
                      disableGutters>
                      {this.renderArtifactsTable()}
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            ) : (
              <div className={classes.boxVariant}>
                <NoRunsIcon
                  fill={theme.palette.text.primary}
                  className={classes.boxVariantIcon}
                />
                <Typography className={classes.boxVariantText} variant="h6">
                  No Runs
                </Typography>
                <Typography className={classes.boxVariantText}>
                  A run will be created when the task gets schedueled.
                </Typography>
              </div>
            )}
          </CardContent>
          <MobileStepper
            variant={runs.length > DOTS_VARIANT_LIMIT ? 'progress' : 'dots'}
            position="static"
            steps={runs.length}
            activeStep={selectedRunId}
            className={classes.root}
            nextButton={
              <Button
                size="small"
                onClick={this.handleNext}
                disabled={selectedRunId === runs.length - 1}>
                Next
                <ChevronRightIcon />
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={this.handlePrevious}
                disabled={selectedRunId === 0}>
                <ChevronLeftIcon />
                Previous
              </Button>
            }
          />
        </div>
      </Card>
    );
  }
}
