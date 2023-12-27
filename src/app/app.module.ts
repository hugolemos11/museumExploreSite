import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { environment } from '../environments/environment.development';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonSiteModule } from './common-site/common-site.module';
import { SobreMuseusComponent } from './sobre-museus/sobre-museus.component';

@NgModule({
  declarations: [
    AppComponent,
    SobreMuseusComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
  imports: [
    AngularFireAuthModule,
    AngularFireModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    AppRoutingModule,
    CommonSiteModule
  ],
  
})
export class AppModule { }
