// Zone.js must be imported first before any Angular imports
import 'zone.js';
import 'zone.js/testing';
import { beforeEach } from 'vitest';

import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment once
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true } }
);

// Reset TestBed between tests to avoid state leakage
beforeEach(() => {
  TestBed.resetTestingModule();
});
