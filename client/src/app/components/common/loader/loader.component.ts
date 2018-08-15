import {Component} from '@angular/core';

@Component({
  selector:    'app-loader',
  templateUrl: './loader.component.html',
  styleUrls:   ['./loader.component.scss']
})

export class LoaderComponent {
  private _loading = false;

  public set loading(value: boolean) {
    this._loading = value;
    this.setVisibility(value);
  }

  public get loading(): boolean {
    return this._loading;
  }

  private setVisibility(visible: boolean): void {
    const loader: any = document.getElementsByClassName('loading_overlay')[0];
    if (visible) {
      loader.style.display = 'block';
    } else {
      loader.style.display = 'none';
    }
  }
}
