import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalesComponent } from './locales.component';
import { LocalComponent } from './local/local.component';

const routes: Routes = [
  {
    path: '',
    component: LocalesComponent
  },
  {
    path: ':id',
    component: LocalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalesRoutingModule { }
