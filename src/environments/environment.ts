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

  NAME: require('../../package.json').name,
  VERSION: require('../../package.json').version,
  LICENSE: require('../../package.json').license,
  HOMEPAGE: require('../../package.json').homepage,
  TAGS: require('../../tags.json').tags,
};
