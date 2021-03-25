import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'

//Services
import { ToasterService } from '../services/toaster.service';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { FirebaseService } from '../services/firebase.service';
import { GlobalSettings } from '../services/global.service';

// Firebase
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';

//commponents
import { FilterComponent } from './components/filter/filter.component'
import { UsersPage } from './users/users.page';
import { EditorModule } from "@tinymce/tinymce-angular";

//Environment secrets
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    GoogleMapsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicModule.forRoot(), 
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    EditorModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UsersPage,
    GlobalSettings,
    AuthService,
    ApiService,
    AlertService,
    ToasterService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
