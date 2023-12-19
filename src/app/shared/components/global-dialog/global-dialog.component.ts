import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-global-dialog',
  standalone : true,
  imports :[MatIconModule,MatButtonModule, MatDialogModule],
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss']
})
export class GlobalDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<GlobalDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any
    ){

  }

  ngOnInit(): void {
  }

  closeDialog(result?: string) {
    this.dialogRef.close(result);
  }


}
