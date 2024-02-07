import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { environment } from '../environments/environment.development';
import { AuthModule } from './auth/auth.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonSiteModule } from './common-site/common-site.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTicketComponent } from './tickets/update-ticket/update-ticket.component';
import { DeleteTicketComponent } from './tickets/delete-ticket/delete-ticket.component';
import { CreateTicketComponent } from './tickets/create-ticket/create-ticket.component';

@NgModule({
  declarations: [
    AppComponent,
    UpdateTicketComponent,
    DeleteTicketComponent,
    CreateTicketComponent
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
    CommonSiteModule,
    AuthModule,
    BrowserAnimationsModule,
    NgbModule
  ]
})
export class AppModule { }
