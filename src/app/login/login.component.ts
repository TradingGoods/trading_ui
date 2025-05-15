import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router, UrlTree} from '@angular/router';
import {AuthService} from '../auth.service';
import { LocalService } from '../local.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnInit {

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private router: Router,private fb: FormBuilder, private authService: AuthService, private localService: LocalService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  loginForm: FormGroup;

  ngAfterViewInit(): void {
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
    
      this.authService.login(formData).subscribe({
        next: (response) => {
          if(!!response) {
          console.log('Login successful', response);
          this.successMessage = 'Login successful';
          this.errorMessage = '';
          this.localService.saveData('authToken', response.token);
          this.router.navigate(['/home']);
          }
          else {
            console.log('Login failed!');
            this.errorMessage = 'Login failed. Please check your credentials.';
            this.successMessage = '';
          }
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorMessage = 'Login failed. Please check your credentials. Reason: ' + error;
          this.successMessage = '';
        }
      });
    } 
  }
  
}
