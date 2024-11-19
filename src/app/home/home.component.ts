import { Component, OnInit } from '@angular/core';
import { GoogleApiService } from '../google-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private googleAuthService: GoogleApiService) { }

  ngOnInit(): void {
  }
  onLogout(){
    this.googleAuthService.logout();
  }

}
