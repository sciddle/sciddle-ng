import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';
import {MaterialModule} from './ui/material/material.module';

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
  ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
];
