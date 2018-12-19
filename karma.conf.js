const neutrino = require('neutrino');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

module.exports = config => {
  neutrino().karma()(config);

  return config.set({
    browsers: [process.env.CI ? 'FirefoxHeadless' : 'Firefox'],
  });
};
