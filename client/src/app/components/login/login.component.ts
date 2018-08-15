import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {LoopbackUserApi} from '../../shared/client-sdk/services/custom/LoopbackUser';
import {LoaderComponent} from '../common/loader/loader.component';
import {ToastComponent} from '../common/toast/toast.component';

@Component({
  selector:    'app-login',
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public email    = '';
  public password = '';

  public constructor(private router: Router,
                     private authenticationService: LoopbackUserApi,
                     private toast: ToastComponent,
                     private loader: LoaderComponent) {
  }

  public ngOnInit(): void {
    this.authenticationService.logout();
  }

  public login(email: string, password: string): void {
    this.loader.loading = true;
    this.authenticationService.login({
      email:    email,
      password: password
    }).subscribe(result => {
      this.router.navigate(['./overview']);
    }, (error: Error) => {
      this.toast.open(error.message);
      this.email    = '';
      this.password = '';
    }, () => {
      this.loader.loading = false;
    });
  }
}
