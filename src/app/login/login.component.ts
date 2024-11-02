import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router, UrlTree} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    // constructor(public authService: AuthService, public router: Router) {
    // }
    constructor() {}


  data = {username: '', password: ''};

    ngOnInit() {
        console.log('Hi!');
    }

    // goTo(path: string | UrlTree): void {
    //     this.router.navigateByUrl(path);
    // }

    // login(form: NgForm): void {
    //     console.log("from login")
    //     this.authService.login(form.value)
    //         .subscribe(result => {
    //             if (result.success) {
    //                 this.goTo('home');
    //             }
    //         });
    // }

}
