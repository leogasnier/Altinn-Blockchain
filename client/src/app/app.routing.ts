import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {OverviewComponent} from './components/overview/overview.component';

const appRoutes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'overview', component: OverviewComponent
  },

  // otherwise redirect to login
  {path: '**', redirectTo: 'login'}
];

export const appRoutingProviders: any[]   = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

