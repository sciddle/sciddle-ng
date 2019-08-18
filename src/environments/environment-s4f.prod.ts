/**
 * Environment settings for production environment
 */
export const environment = {
  production: true,
  APP_NAME: 'Sciddle',
  DATABASE_ENTITIES: 'sciddle',
  DATABASE_SETTINGS: 'sciddle_settings',

  VARIANT: 'S4F',

  TIMER: 30,
  DEFAULT_STACK: 2,

  MIN_CARDS: 20,
  API_DELAY: 500,
  API_TIMEOUT: 7500,
  MAX_CARD_COUNT: 1000,

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  AUTHOR_CODE: require('../../package.json').authorCode,
  AUTHOR_CONTENT: require('../../package.json').authorContent,
  AUTHOR_SCIENTIFIC_SUPERVISION: require('../../package.json').authorScientificSupervision,
  LICENSE_CODE: require('../../package.json').licenseCode,
  LICENSE_CONTENT: require('../../package.json').licenseContent,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
  DEPENDENCIES: require('../../package.json').dependencies,
  DEV_DEPENDENCIES: require('../../package.json').devDependencies,
};
