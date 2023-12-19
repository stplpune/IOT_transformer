import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecureRoutingModule } from './secure-routing.module';
import { SecureComponent } from './secure.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SecureComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    SecureRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    RouterModule,
    MatSnackBarModule, 
    MatDialogModule,
    MatTooltipModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SecureModule { }
