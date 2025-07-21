import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResourceListComponent } from './components/resource-list/resource-list.component'
import { HttpClientModule } from '@angular/common/http';
import { HelpDeskComponent } from "./components/help-desk/help-desk.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ResourceListComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
}
