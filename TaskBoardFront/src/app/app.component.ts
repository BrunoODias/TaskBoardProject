import { Component } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TaskBoard';

  public ToastDefaultConfig = new ToasterConfig({
    tapToDismiss: true,
    showCloseButton: false,
    timeout: 3500,
    positionClass: 'toast-bottom-right',
  });
}
