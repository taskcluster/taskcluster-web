import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { Switch } from 'react-router-dom';
import RouteWithProps from '../../components/RouteWithProps';
import loadable from '../../utils/loadable';

const ViewHooks = loadable(() =>
  import(/* webpackChunkName: 'Clients.ViewHooks' */ './ViewHooks')
);
const ViewHook = loadable(() =>
  import(/* webpackChunkName: 'Clients.ViewHook' */ './ViewHook')
);

@hot(module)
export default class Hooks extends Component {
  render() {
    const {
      match: { path },
      ...props
    } = this.props;

    return (
      <Switch>
        <RouteWithProps
          path={`${path}/create`}
          isNewHook
          {...props}
          component={ViewHook}
        />
        <RouteWithProps
          path={`${path}/:hookGroupId/:hookId`}
          {...props}
          component={ViewHook}
        />
        <RouteWithProps path={path} {...props} component={ViewHooks} />
      </Switch>
    );
  }
}
