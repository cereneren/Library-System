import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {environment} from './environments/environment.development'
import axios from 'axios';

axios.defaults.baseURL= environment.apiUrl;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
