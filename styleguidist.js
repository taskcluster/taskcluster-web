const { join } = require("path");

module.exports = (neutrino, opts = {}) => {
  neutrino.register('styleguide', () => ({
    webpackConfig: neutrino.config.toConfig(),
    components: join(
      neutrino.options.source,
      'components/**',
      `*.{${neutrino.options.extensions.join(',')}}`
    ),
    skipComponentsWithoutExample: true,
    ...opts,
  }));
};
