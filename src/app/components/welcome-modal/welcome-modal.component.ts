import { Component, Input } from '@angular/core';
import { MyServiceService } from '../../my-service.service';
import { Details } from '../../../interfaces/interface';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-modal',
  standalone: true,
  imports: [MatIcon, CommonModule,RouterLink],
  templateUrl: './welcome-modal.component.html',
  styleUrl: './welcome-modal.component.css'
})
export class WelcomeModalComponent {
  constructor(private http: MyServiceService) { }

  ngOnInit() {
    const showWelcome = sessionStorage.getItem('showWelcomeModal');
    console.log('showWelcome:', showWelcome);

    if (showWelcome === 'true') {
      this.showModal = true;
    } else {
      this.showModal = false;
    }
  }

  showModal = true;

  dismissForever() {
    this.showModal = false;
    localStorage.setItem('showWelcomeModal', 'false');
  }

  remindMeNextTime() {
    this.showModal = false;
    sessionStorage.setItem('showWelcomeModal', 'false');
  }

  closeModal() {
    this.showModal = false;
    sessionStorage.setItem('showWelcomeModal', 'false');
  }
}
