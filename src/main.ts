import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


  // client id = 30867431224-5ei6frs1e5phh94nnicngss4p4ecs1rd.apps.googleusercontent.com
  // client secret = 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
