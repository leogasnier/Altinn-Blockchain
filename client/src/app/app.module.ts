import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {appRoutingProviders, routing} from './app.routing';
import {Configuration} from './app.constants';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {AuthenticationService} from './services/authentication.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
// todo: remove HttpModule and replace with HttpClientModule -- Also check loopback for this.
import {OverviewComponent} from './components/overview/overview.component';
import {HeaderComponent} from './components/header/header.component';
import {AuthGuard} from './guards';
import {SDKBrowserModule} from './shared/client-sdk/index';
import {LoopbackUserApi} from './shared/client-sdk/services/custom/LoopbackUser';
import {AssetApi} from './shared/client-sdk/services/custom';
import {ErrorModalComponent} from './components/common/error-modal/error-modal.component';
import {UserUtility} from './utils/UserUtility';
import {LoaderComponent} from './components/common/loader/loader.component';
import {ToastComponent} from './components/common/toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OverviewComponent,
    HeaderComponent,
    ErrorModalComponent,
    LoaderComponent,
    ToastComponent
  ],
  imports:      [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    SDKBrowserModule.forRoot(),
    routing
  ],
  providers:    [
    appRoutingProviders,
    Configuration,
    AuthenticationService,
    AuthGuard,
    LoopbackUserApi,
    AssetApi,
    UserUtility,
    ToastComponent,
    LoaderComponent
  ],
  bootstrap:    [AppComponent]
})

export class AppModule {
}
