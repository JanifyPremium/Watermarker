import { bootstrapApplication } from '@angular/platform-browser';
import { WatermarkComponent } from './app/watermark/watermark';
import { importProvidersFrom, NgZone } from '@angular/core';
import 'zone.js';
import { FormsModule } from '@angular/forms';

const appConfig = {
  providers: [
    importProvidersFrom(FormsModule)  
  ],
};

bootstrapApplication(WatermarkComponent, appConfig)
  .catch(err => console.error(err));
