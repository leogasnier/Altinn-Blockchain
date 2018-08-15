import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {UserUtility} from '../../utils/UserUtility';

@Component({
  selector:    'app-header',
  templateUrl: './header.component.html',
  styleUrls:   ['./header.component.scss']
})

export class HeaderComponent {
  private loggedUser: string;

  public constructor(private router: Router,
                     private userUtility: UserUtility) {
    this.loggedUser = this.userUtility.getUserRole().toLowerCase();
  }
}
