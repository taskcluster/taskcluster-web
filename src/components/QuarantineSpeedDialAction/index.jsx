import { PureComponent, Fragment } from 'react';
import { func } from 'prop-types';
import { format, addYears } from 'date-fns';
import TextField from 'material-ui/TextField';
import HomeLockIcon from 'mdi-react/HomeLockIcon';
import HomeLockOpenIcon from 'mdi-react/HomeLockOpenIcon';
import SpeedDialActionDialog from '../SpeedDialActionDialog';
import { date } from '../../utils/prop-types';

/**
 * Display a speed dial action able to quarantine a worker.
 * Clicking the button provides the ability to change the
 * state (`quarantineUntil`) of the worker via a dialog.
 */
export default class QuarantineSpeedDialAction extends PureComponent {
  static propTypes = {
    /**
     * Once the `quarantineUntil` time has elapsed, the worker
     * resumes accepting jobs.
     */
    quarantineUntil: date,
    /** The callback to trigger when the action button is clicked */
    onQuarantineClick: func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      quarantineUntil: props.quarantineUntil
        ? new Date(props.quarantineUntil)
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
      <SpeedDialActionDialog
        icon={quarantineUntil ? <HomeLockOpenIcon /> : <HomeLockIcon />}
        tooltipTitle={quarantineUntil ? 'Update Quarantine' : 'Quarantine'}
        title="Quarantine?"
        body={
          <Fragment>
            <Fragment>
              Quarantining a worker allows the machine to remain alive but not
              accept jobs. Note that a quarantine can be lifted by setting
              Quarantine Until to the present time or somewhere in the past.
            </Fragment>
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
        {...props}
      />
    );
  }
}
