import {Component, Input} from '@angular/core';
import * as M from '../../../../../node_modules/materialize-css/'

@Component({
  selector:    'app-toast',
  templateUrl: './toast.component.html',
  styleUrls:   ['./toast.component.scss']
})

export class ToastComponent {
  @Input() public toastMessage: string;

  public open(toastMessage): void {
    M.toast({html: toastMessage})
  }
}
