import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router, UrlTree} from '@angular/router';
import {AuthService} from '../auth.service';
import { GoogleApiService } from '../google-api.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  constructor(private googleAuthService: GoogleApiService, private router: Router) {}

  

  ngAfterViewInit(): void {
    this.googleAuthService.initializeAuth();
    this.googleAuthService.authResponse$.subscribe(response => {
      console.log('User Authenticated:', response);
      if (response) {
        // User is authenticated, navigate to home
        this.googleAuthService.saveToken(response);
      }
    });
  }
}
