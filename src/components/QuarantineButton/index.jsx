import { PureComponent, Fragment } from 'react';
import { func } from 'prop-types';
import TextField from 'material-ui/TextField';
import { format, addYears } from 'date-fns';
import DialogAction from '../DialogAction';
import Markdown from '../Markdown';
import { date } from '../../utils/prop-types';

/**
 * Display a button able to quarantine a worker.
 * Clicking the button provides the ability to change the
 * state (`quarantineUntil`) of the worker via a dialog.
 */
export default class QuarantineButton extends PureComponent {
  static propTypes = {
    /**
     * Once the `quarantineUntil` time has elapsed, the worker
     * resumes accepting jobs.
     */
    quarantineUntil: date.isRequired,
    /** The callback to trigger when the action button is clicked */
    onQuarantineClick: func.isRequired,
  };

  static getDerivedStateFromProps(nextProps) {
    return {
      quarantineUntil: nextProps.quarantineUntil
        ? new Date(nextProps.quarantineUntil)
        : addYears(new Date(), 1000),
    };
  }

  handleQuarantineClick = () => {
    this.props.onQuarantineClick(format(this.state.quarantineUntil));
  };

  handleQuarantineChange = ({ target }) => {
    this.setState({ quarantineUntil: new Date(target.value) });
  };

  render() {
    const { quarantineUntil, onQuarantineClick: _, ...props } = this.props;

    return (
      <DialogAction
        tooltipProps={{
          id: 'quarantine-tooltip',
          title: quarantineUntil
            ? 'Enabling a worker will resume accepting jobs.'
            : 'Quarantining a worker allows the machine to remain alive but not accept jobs.',
        }}
        title="Quarantine?"
        body={
          <Fragment>
            <Markdown>
              Quarantining a worker allows the machine to remain alive but not
              accept jobs. Note that a quarantine can be lifted by setting
              `quarantineUntil` to the present time (or somewhere in the past).
            </Markdown>
            <br />
            <br />
            <TextField
              id="date"
              label="Quarantine Until"
              type="date"
              value={format(this.state.quarantineUntil, 'YYYY-MM-DD')}
              onChange={this.handleQuarantineChange}
            />
          </Fragment>
        }
        confirmText="Quarantine"
        onActionClick={this.handleQuarantineClick}
        {...props}>
        Quarantine
      </DialogAction>
    );
  }
}
