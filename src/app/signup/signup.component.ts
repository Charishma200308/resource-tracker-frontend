import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyServiceService } from '../my-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: MyServiceService, private router: Router) {}

  onSignup() {

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!this.username || !this.email || !this.password) {
      alert('Please fill all required fields!');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        alert('Signup successful! You can now login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Signup failed: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
