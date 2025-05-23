import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'forgot-pass', component: ForgotPassComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
