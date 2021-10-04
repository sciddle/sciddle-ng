import {MaterialColorService} from './services/material-color.service';
import {MaterialIconService} from './services/material-icon.service';
import {MediaService} from './services/media.service';
import {SnackbarService} from './services/snackbar.service';

/** Providers for ui module */
export const UiProviders = [
  MaterialColorService,
  MaterialIconService,
  MediaService,
  SnackbarService,
];
