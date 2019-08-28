/**
 * Environment settings for production environment
 */
export const environment = {
  production: true,
  APP_NAME: 'Cards for Future',
  DATABASE_ENTITIES: 'sciddle',
  DATABASE_SETTINGS: 'sciddle_settings',

  VARIANT: 'S4F',

  GAME_MODE_SINGLE_PLAYER: 'Freies Spiel',
  GAME_MODE_MULTI_PLAYER: 'Spielrunde starten',

  TIMER: 30,
  DEFAULT_STACK: 2,

  MIN_CARDS: 20,
  API_DELAY: 500,
  API_TIMEOUT: 7500,
  MAX_CARD_COUNT: 1000,

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  AUTHOR_CODE: require('../../package.json').authorCode,
  AUTHOR_ORIGINAL: require('../../package.json').authorOriginal,
  AUTHOR_CONTENT: require('../../package.json').authorContent,
  AUTHOR_SCIENTIFIC_SUPERVISION: require('../../package.json').authorScientificSupervision,
  GITHUB_URL: require('../../package.json').githubUrl,
  LICENSE_CODE: require('../../package.json').licenseCode,
  LICENSE_CONTENT: require('../../package.json').licenseContent,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
  DEPENDENCIES: require('../../package.json').dependencies,
  DEV_DEPENDENCIES: require('../../package.json').devDependencies,
};
