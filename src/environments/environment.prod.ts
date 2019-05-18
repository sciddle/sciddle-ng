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
  AUTHOR_CODE: require('../../package.json').authorCode,
  AUTHOR_CONTENT: require('../../package.json').authorContent,
  LICENSE_CODE: require('../../package.json').licenseCode,
  LICENSE_CONTENT: require('../../package.json').licenseContent,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
