import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ExpenseGuard } from 'src/app/core/guards/expense.guard';

const routes: Routes = [
  { path: 'dashboard', loadComponent: () => import('../../components/dashboard/dashboard.component').then(c => c.DashboardComponent) , data: { breadcrumb: [{ title: 'Dashboard', active: true }] }},
    { path: 'page-right-access', loadComponent: ()=> import ('../../components/page-right-access/page-right-access.component').then(c => c.PageRightAccessComponent) , data: { breadcrumb: [{ title: 'Page Right Access', active: true }] }},

    { path: 'user-register', loadComponent: () => import('../../components/user-register/user-register.component').then(c => c.UserRegisterComponent) , data: { breadcrumb: [{ title: 'User Register', active: true }] }},
    { path: 'feeder-register', loadComponent: () => import('../../components/feeder-register/feeder-register.component').then(c => c.FeederRegisterComponent) , data: { breadcrumb: [{ title: 'Feeder Register', active: true }] }},
    { path: 'device-register', loadComponent: () => import('../../components/device-register/device-register.component').then(c => c.DeviceRegisterComponent) , data: { breadcrumb: [{ title: 'Device Register', active: true }] }},
    { path: 'transformer-register', loadComponent: () => import('../../components/transformer-register/transformer-register.component').then(c => c.TransformerRegisterComponent) , data: { breadcrumb: [{ title: 'Transformer Register', active: true }] }},
    { path: 'substation-register', loadComponent: () => import('../../components/substation-register/substation-register.component').then(c => c.SubstationRegisterComponent) , data: { breadcrumb: [{ title: 'Substation Register', active: true }] }},
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
