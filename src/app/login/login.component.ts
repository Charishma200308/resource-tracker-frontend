import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { MyServiceService } from '../my-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  password = '';
  email = '';
  rememberMe = false;

  constructor(private router: Router, private authService: MyServiceService) {}

  onLogin() {
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (res: any) => {
        this.authService.storeToken(res.token);
        localStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('showWelcomeModal', 'true');
        this.router.navigate(['/Home']);
      },
      error: (err) => {
        alert('Login failed: ' + (err.error?.message || 'Invalid credentials'));
      }
    });
  }
}
