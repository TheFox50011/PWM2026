import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import 'zone.js';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideIonicAngular } from '@ionic/angular/standalone';


import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({}),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())

  ]
};
