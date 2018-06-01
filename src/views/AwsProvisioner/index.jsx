import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { Switch } from 'react-router-dom';
import RouteWithProps from '../../components/RouteWithProps';
import loadable from '../../utils/loadable';

const ViewAwsHealth = loadable(() =>
  import(/* webpackChunkName: 'Clients.ViewClients' */ './ViewAwsHealth')
);

@hot(module)
export default class Clients extends Component {
  render() {
    const {
      match: { path },
      ...props
    } = this.props;

    return (
      <Switch>
        <RouteWithProps
          path={`${path}/aws-health`}
          {...props}
          component={ViewAwsHealth}
        />
      </Switch>
    );
  }
}
