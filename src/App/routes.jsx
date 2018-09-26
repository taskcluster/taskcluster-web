import loadable from '../utils/loadable';

export default [
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Documentation' */ '../views/Documentation')
    ),
    path: '/docs',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Tasks' */ '../views/Tasks')
    ),
    path: '/tasks',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Provisioners' */ '../views/Provisioners')
    ),
    path: '/provisioners',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Clients' */ '../views/Clients')
    ),
    path: '/auth/clients',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Roles' */ '../views/Roles')
    ),
    path: '/auth/roles',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'ScopesetExpander' */ '../views/ScopesetExpander')
    ),
    path: '/scopesets/expand',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'ScopesetComparison' */ '../views/ScopesetComparison')
    ),
    path: '/scopesets/compare',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Scopes' */ '../views/Scopes')
    ),
    path: '/auth/scopes',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Hooks' */ '../views/Hooks')
    ),
    path: '/hooks',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'AWS Provisioner' */ '../views/AwsProvisioner')
    ),
    path: '/aws-provisioner',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Hooks' */ '../views/AwsProvisioner')
    ),
    path: '/aws-provisioner',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Secrets' */ '../views/Secrets')
    ),
    path: '/secrets',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'CachePurges' */ '../views/CachePurges')
    ),
    path: '/purge-caches',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'PulseMessages' */ '../views/PulseMessages')
    ),
    path: '/pulse-messages',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Quickstart' */ '../views/Quickstart')
    ),
    path: '/quickstart',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Profile' */ '../views/Profile')
    ),
    path: '/profile',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Shell' */ '../views/Shell')
    ),
    path: '/shell',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'Displays' */ '../views/Display')
    ),
    path: '/display',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'HomeOrDashboard' */ '../views/HomeOrDashboard')
    ),
    path: '/',
  },
  {
    component: loadable(() =>
      import(/* webpackChunkName: 'NotFound' */ '../views/NotFound')
    ),
  },
];
