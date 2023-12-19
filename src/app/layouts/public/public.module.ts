import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PublicComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    RouterModule
  ],
  exports:[]
})
export class PublicModule { }
