import {AppRoutingModule} from './app-routing.module';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from './ui/material/material.module';
import {CoreModule} from './core/core.module';

/** Imports for app module */
export const AppImports  = [
  AppRoutingModule,
  BrowserAnimationsModule,
  BrowserModule,
  FormsModule,
  HttpClientModule,

  MaterialModule,

  // Core service
  CoreModule,

  // Progressive Web App
  ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})
];
