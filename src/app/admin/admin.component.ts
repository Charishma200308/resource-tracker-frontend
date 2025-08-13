import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatIcon,CommonModule,RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  websiteSettingsOpen = false;
  constructor(private location: Location, private router: Router) {}

  toggleWebsiteSettings() {
    this.websiteSettingsOpen = !this.websiteSettingsOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  goBack() {
  if (window.history.length > 1) {
    this.location.back(); 
  } else {
    this.router.navigate(['/home']); 
  }
}
}
