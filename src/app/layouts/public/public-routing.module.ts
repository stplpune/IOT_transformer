import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicComponent } from './public.component';

const routes: Routes = [
  // {path:'',redirectTo:'login',pathMatch:'full'},
  { path: '', component: PublicComponent },
  { path: 'login', loadComponent: () => import('../../components/login/login.component').then(c => c.LoginComponent), data: { breadcrumb: [{ title: 'Login', active: true }] }},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
