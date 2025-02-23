import { Component } from '@angular/core';
import { ImageComponent } from './image/image.component';


@Component({
  selector: 'app-root',
  imports: [ ImageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular-UI-Task';
}
