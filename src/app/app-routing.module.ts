import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

// const routes: Routes = [
//   {path: '', redirectTo: '/login', pathMatch: 'full'},
//     {
//         path: 'home', component: HomeComponent,
//         canActivate: [AuthService]
//     },
//     {path: 'login', component: LoginComponent},
// ];

@NgModule({
})
export class AppRoutingModule { }
