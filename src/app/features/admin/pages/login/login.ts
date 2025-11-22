import { Component } from '@angular/core';
import { Auth } from '../../../../code/services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  imports: [FormsModule],
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: Auth, private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      alert('Please enter email and password.');
      return false;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        alert('Login successful!');
        this.router.navigate(['/admin']);
      },
      error: (err) => alert('Login failed: ' + (err.message || err))
    });

    return true;
  }
}
