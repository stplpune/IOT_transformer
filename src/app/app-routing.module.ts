import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureComponent } from './layouts/secure/secure.component';
import { ErrorComponent } from './components/error/error.component';
import { PublicComponent } from './layouts/public/public.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: PublicComponent,
   loadChildren: () => import('./layouts/public/public.module').then(m => m.PublicModule) },
  {
    path: '',
    canActivate: [AuthGuard],
    component: SecureComponent,
    loadChildren: () => import('./layouts/secure/secure.module').then(m => m.SecureModule)
  },
  // { path: 'error', loadChildren: () => import('./components/error/error.module').then(m => m.ErrorModule) },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
