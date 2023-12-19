import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

}
