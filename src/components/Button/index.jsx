import React, { Component } from 'react';
import ReactGA from 'react-ga';
import MuiButton from '@material-ui/core/Button';
import { string, number, node, bool } from 'prop-types';
import { withAuth } from '../../utils/Auth';

@withAuth
/**
 * A Material UI button augmented with application specific props.
 */
export default class Button extends Component {
  static defaultProps = {
    requiresAuth: false,
  };

  static propTypes = {
    /** The content of the button. */
    children: node.isRequired,
    /** If true, the button will be disabled if the user is not authenticated */
    requiresAuth: bool,
    /** If true, the button will send an analytic event to Google */
    trackEvent: bool,
    /**
     * Google analytics event category. Defaults to 'Uncategorized'.
     * A top level category for the event.
     * E.g. 'User', 'Navigation', 'App Editing', etc.
     * */
    gaEventCategory: string,
    /**
     * Google analytics event action. Defaults to 'Click'.
     * A description of the behaviour.
     * E.g. 'Clicked Delete', 'Added a component', 'Deleted account', etc.
     * */
    gaEventAction: string,
    /**
     * Google analytics event label.
     * A description of the behaviour.
     * E.g. 'Clicked Delete', 'Added a component', 'Deleted account', etc.
     * */
    gaEventLabel: string,
    /**
     * Google analytics event value.
     * A means of recording a numerical value against an event.
     * E.g. a rating, a score, etc.
     */
    gaEventValue: number,
    /**
     * Google analytics event non interaction.
     * If an event is not triggered by a user interaction, but instead by the
     * code (e.g. on page load),
     * it should be flagged as a nonInteraction event to avoid
     * skewing bounce rate data.
     */
    gaEventNonInteraction: bool,
    /**
     * Google analytics event transport
     * This specifies the transport mechanism with which hits will be sent.
     * Valid values include 'beacon', 'xhr', or 'image'.
     */
    gaEventTransport: string,
  };

  static defaultProps = {
    requiresAuth: false,
    gaEventCategory: 'Uncategorized',
    gaEventAction: 'Click',
    gaEventLabel: null,
    gaEventValue: null,
    gaEventNonInteraction: null,
    gaEventTransport: null,
    trackEvent: false,
  };

  handleButtonClick = () => {
    const {
      onClick,
      gaEventLabel,
      gaEventAction,
      gaEventCategory,
      gaEventNonInteraction,
      gaEventTransport,
      trackEvent,
    } = this.props;

    if (
      trackEvent &&
      gaEventCategory &&
      gaEventAction &&
      process.env.GA_TRACKING_ID
    ) {
      ReactGA.event({
        category: gaEventCategory,
        action: gaEventAction,
        label: gaEventLabel,
        value: gaEventLabel,
        nonInteraction: gaEventNonInteraction,
        gaTransport: gaEventTransport,
      });
    }

    if (onClick) {
      onClick();
    }
  };

  render() {
    const {
      children,
      requiresAuth,
      disabled,
      user,
      onClick,
      trackEvent,
      gaEventLabel,
      gaEventAction,
      gaEventCategory,
      gaEventValue,
      gaEventNonInteraction,
      gaEventTransport,
      ...props
    } = this.props;
    const isDisabled = (requiresAuth && !user) || disabled;

    return (
      <MuiButton
        onClick={this.handleButtonClick}
        disabled={isDisabled}
        {...props}>
        {children}
      </MuiButton>
    );
  }
}
