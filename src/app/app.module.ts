import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BackendProvider } from '../providers/backend';
import { HttpClientModule } from '@angular/common/http';
import { CacheModule } from "ionic-cache";
import { Network } from '@ionic-native/network';
import { GlobalProvider } from '../providers/global';
import { UtilsProvider } from '../providers/utils'
import { AuthProvider } from '../providers/auth';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginPage } from '../pages/login/login';


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    CacheModule.forRoot(),
    HttpClientModule,
    LoginPageModule
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BackendProvider,
    Network,
    GlobalProvider,
    UtilsProvider,
    AuthProvider
    
  ]
})
export class AppModule {}
