import {Component, Input} from '@angular/core';

@Component({
  selector:    'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls:   ['./error-modal.component.scss']
})
export class ErrorModalComponent {
  @Input() public errorMessage: string;

  public static open(): void {
    $(function (jQuery) {
      jQuery('#error-modal').modal().modal('open');
    });
  }
}
