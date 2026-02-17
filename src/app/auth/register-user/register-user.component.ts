import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register-user',
  imports: [],
  templateUrl: './register-user.component.html',
  styleUrls: ['../login-user/login-user.component.scss', './register-user.component.scss'],
})
export class RegisterUserComponent {
  private fb = inject(FormBuilder);
  registerForm!: FormGroup;
}
