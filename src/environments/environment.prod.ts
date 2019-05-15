/**
 * Environment settings for production environment
 */
export const environment = {
  production: true,
  APP_NAME: 'Sciddle',
  DATABASE_ENTITIES: 'sciddle',
  DATABASE_SETTINGS: 'sciddle_settings',

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
