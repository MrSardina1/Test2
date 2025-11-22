import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {
  oldPassword = '';
  newPassword = '';

  updatePassword() {
    if (this.oldPassword.length === 0 || this.newPassword.length === 0) {
      alert('Please fill all fields');
      return false;
    }
    alert('Password updated successfully!');
    return true;
  }
}
