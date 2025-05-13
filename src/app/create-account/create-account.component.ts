import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalService } from '../local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomHttpService } from '../custom-http-service.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit{
  createAccountForm: FormGroup;
  receivedData: any;



  constructor(private fb: FormBuilder, private localService: LocalService, private route: ActivatedRoute,private router: Router, private customHttpService: CustomHttpService) {
    this.createAccountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['',[ Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  get phone() {
    return this.createAccountForm.get('phone');
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        const data = JSON.parse(decodeURIComponent(params['data']));
        this.receivedData = data;
      }
    });
    if(!!this.receivedData){
      const fullName = this.receivedData.name;
      const [firstName, lastName] = fullName.split(" ");
      this.createAccountForm.patchValue({
        firstName: firstName || '',
        lastName: lastName || '',
        email: this.receivedData.email || ''
      });

      // Disable fields if data is provided
      if (firstName) {
        this.createAccountForm.get('firstName')?.setValue(firstName);
        this.createAccountForm.get('firstName')?.disable();
      }
      if (lastName) {
        this.createAccountForm.get('firstName')?.setValue(lastName);
        this.createAccountForm.get('lastName')?.disable();
      }
      if (this.receivedData.email) {
        this.createAccountForm.get('email')?.setValue(this.receivedData.email);
        this.createAccountForm.get('email')?.disable();
      }
    }
    console.log(this.receivedData);
  }


  // Custom validator to check if passwords match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.createAccountForm.valid) {
      const formData:any = {};
      formData.firstName = this.createAccountForm.controls['firstName'].value;
      formData.lastName = this.createAccountForm.controls['lastName'].value;
      formData.emailId = this.createAccountForm.controls['email'].value;
      formData.phoneNumber = this.createAccountForm.controls['phone'].value;
      formData.password = this.createAccountForm.controls['password'].value;
      formData.profile_pic_url = this.receivedData?.picture;
      console.log('Account Created:', formData);
      this.customHttpService.post('api/auth/register',formData)
      .pipe(
        tap((backendResponse: any) => {
          this.router.navigate(['/login']);
        })
      ) 
      .subscribe({
        error: (err) => {
          console.error('Error verifying token:', err);
        }
      });
    }
  }


}
