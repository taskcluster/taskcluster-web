const { join } = require('path');
const merge = require('deepmerge');
const MODULES = join(__dirname, 'node_modules');

module.exports = {
  use: [
    ['@neutrinojs/airbnb', {
      eslint: {
        parserOptions: {
          ecmaFeatures: {
            legacyDecorators: true
          }
        },
        emitWarning: process.env.NODE_ENV === 'development',
        baseConfig: {
          extends: ['eslint-config-prettier', 'plugin:react/recommended'],
        },
        envs: ['worker', 'serviceworker'],
        plugins: ['prettier'],
        rules: {
          'no-nested-ternaries': '0',
          'import/no-extraneous-dependencies': 'off',
          // Specify the maximum length of a line in your program
          'max-len': [
            'error',
            80,
            2,
            {
              ignoreUrls: true,
              ignoreComments: false,
              ignoreStrings: true,
              ignoreTemplateLiterals: true,
            },
          ],
          // Allow using class methods with static/non-instance functionality
          // React lifecycle methods commonly do not use an instance context for
          // anything
          'class-methods-use-this': 'off',
          // Allow console during development, otherwise throw an error
          'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
          // Allow extra parentheses since multiline JSX being wrapped in parens
          // is considered idiomatic
          'no-extra-parens': 'off',
          // Our frontend strives to adopt functional programming practices,
          // so we prefer const over let
          'prefer-const': 'error',
          'prettier/prettier': [
            'error',
            {
              singleQuote: true,
              trailingComma: 'es5',
              bracketSpacing: true,
              jsxBracketSameLine: true,
            },
          ],
          'padding-line-between-statements': [
            'error',
            {
              blankLine: 'always',
              prev: ['const', 'let', 'var'],
              next: '*',
            },
            {
              blankLine: 'never',
              prev: ['const', 'let', 'var'],
              next: ['const', 'let', 'var'],
            },
            {
              blankLine: 'always',
              prev: ['cjs-import'],
              next: '*',
            },
            {
              blankLine: 'always',
              prev: ['import'],
              next: '*',
            },
            {
              blankLine: 'always',
              prev: '*',
              next: ['cjs-export'],
            },
            {
              blankLine: 'always',
              prev: '*',
              next: ['export'],
            },
            {
              blankLine: 'never',
              prev: ['import'],
              next: ['import'],
            },
            {
              blankLine: 'never',
              prev: ['cjs-import'],
              next: ['cjs-import'],
            },
            {
              blankLine: 'any',
              prev: ['export'],
              next: ['export'],
            },
            {
              blankLine: 'any',
              prev: ['cjs-export'],
              next: ['cjs-export'],
            },
            { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
            {
              blankLine: 'always',
              prev: '*',
              next: ['if', 'do', 'for', 'switch', 'try', 'while'],
            },
            { blankLine: 'always', prev: '*', next: 'return' },
          ],
          'consistent-return': 'off',
          'no-shadow': 'off',
          'no-return-assign': 'off',
          'babel/new-cap': 'off',
          'no-mixed-operators': 'off',
        },
      },
    }],
    ['@neutrinojs/react', {
      html: {
        title: process.env.APPLICATION_NAME
      },
      devServer: {
        port: process.env.PORT || 9000,
        historyApiFallback: { disableDotRule: true },
        proxy: {
          '/login': {
            target: 'http://localhost:3050',
          },
          '/graphql': {
            target: 'http://localhost:3050',
          },
          '/subscription': {
            ws: true,
            changeOrigin: true,
            target: 'http://localhost:3050',
          },
        },
      },
      env: [
        'APPLICATION_NAME',
        'LOGIN_STRATEGIES',
        'PORT',
        'TASKCLUSTER_ROOT_URL',
        'GRAPHQL_SUBSCRIPTION_ENDPOINT',
      ],
      babel: {
        plugins: [
          [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
          require.resolve('@babel/plugin-proposal-class-properties'),
        ],
      },
    }],
    (neutrino) => {
      if (process.env.NODE_ENV === 'development') {
        neutrino.config.devtool('cheap-module-source-map');
      }

      neutrino.config.node.set('Buffer', true);

      // The shell view requires this
      neutrino.config
        .externals(merge(neutrino.config.get('externals'), {
          bindings: 'bindings'
        }));

      // TODO: Why is this needed?
      neutrino.config.resolve.modules.add(MODULES);
      // neutrino.config.resolveLoader.modules.add(MODULES);

      neutrino.config.output.publicPath('/');
      neutrino.config.module
        .rule('graphql')
          .test(/\.graphql$/)
          .include
            .add(neutrino.options.source)
            .end()
          .use('gql-loader')
            .loader(require.resolve('graphql-tag/loader'));

      // The JSONStream module's main file has a Node.js shebang
      // which Webpack doesn't like loading as JS
      neutrino.config.module
        .rule('shebang')
          .test(/JSONStream/)
          .use('shebang')
            .loader('shebang-loader');

      console.log(JSON.stringify(neutrino.config.toConfig(), null, 2));
    },
    '@neutrinojs/karma',
  ],
};
