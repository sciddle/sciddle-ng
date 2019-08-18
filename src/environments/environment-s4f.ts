// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

/**
 * Environment settings for development environment
 */
export const environment = {
  production: false,
  APP_NAME: 'Sciddle Dev',
  DATABASE_ENTITIES: 'sciddle-dev',
  DATABASE_SETTINGS: 'sciddle_settings-dev',

  VARIANT: 'S4F',

  TIMER: 10,
  DEFAULT_STACK: 2,

  MIN_CARDS: 2,
  API_DELAY: 500,
  API_TIMEOUT: 2500,
  MAX_CARD_COUNT: 10,

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
