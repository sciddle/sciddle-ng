/**
 * Environment settings for production environment
 */
export const environment = {
  production: true,
  baseHref: "/",
  APP_NAME: 'Cards for Future',
  DATABASE_ENTITIES: 's4f',
  DATABASE_SETTINGS: 's4f_settings',

  VARIANT: 'S4F',

  TIMER_EASY: 30,
  TIMER_MEDIUM: 45,
  TIMER_HARD: 60,
  DEFAULT_STACK: 2,

  MIN_CARDS: 20,
  API_DELAY: 500,
  API_TIMEOUT: 7500,
  MAX_CARD_COUNT: 1000,

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  AUTHOR_CODE: require('../../package.json').authorCode,
  AUTHOR_CODE_URL: require('../../package.json').authorCodeUrl,
  AUTHOR_ORIGINAL: require('../../package.json').authorOriginal,
  AUTHOR_CONTENT: require('../../package.json').authorContent,
  AUTHOR_GRAPHICS: require('../../package.json').authorGraphics,
  AUTHOR_GRAPHICS_URL: require('../../package.json').authorGraphicsUrl,
  AUTHOR_SCIENTIFIC_SUPERVISION: require('../../package.json').authorScientificSupervision,
  GITHUB_URL: require('../../package.json').githubUrl,
  LICENSE_CODE: require('../../package.json').licenseCode,
  LICENSE_CONTENT: require('../../package.json').licenseContent,
  HOMEPAGE: require('../../package.json').homepage,
  DEPENDENCIES: require('../../package.json').dependencies,
  DEV_DEPENDENCIES: require('../../package.json').devDependencies,
};
