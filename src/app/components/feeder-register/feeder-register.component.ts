import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/core/services/api.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { AddFeederComponent } from './add-feeder/add-feeder.component';

@Component({
  selector: 'app-feeder-register',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  providers: [CommonMethodsService, ApiService, ErrorsService],
  templateUrl: './feeder-register.component.html',
  styleUrls: ['./feeder-register.component.scss']
})
export class FeederRegisterComponent {

  dataSource: any;
  tableDatasize!: number;
  // totalPages!: number;
  pageNumber: number = 1;
  displayedColumns = ['srNo', 'feederName', 'substationName', 'action'];
  textSearch = new FormControl('');

  constructor(
    private apiService: ApiService,
    public commonMethod: CommonMethodsService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorsService,
    public validation: ValidationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAllFeeder();
  }

  getAllFeeder() {
    this.spinner.show();
    let obj = '?pageno=' + this.pageNumber + '&pagesize=' + 10 + '&search=' + this.textSearch.value?.trim();
    this.apiService.setHttp('GET', 'MSEB_iOT/api/Feeder/GetAllFeeder' + obj, false, false, false, 'baseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == 200) {
          this.dataSource = res?.responseData;
          // this.totalPages = res.responseData1.totalPages;
          this.tableDatasize = res.responseData1.totalCount;
        } else {
          this.spinner.hide();
          this.dataSource = [];
          this.tableDatasize = 0;
        }
      },
      error: ((err: any) => { this.spinner.hide(), this.errorService.handelError(err), this.dataSource = []; })
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.pageIndex;
    this.getAllFeeder();
  }

  addEditFeederModal(data?: any) {
    const dialog = this.dialog.open(AddFeederComponent, {
      width: '600px',
      data: data,
      disableClose: true,
      autoFocus: false
    })

    dialog.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        this.getAllFeeder();
      }
    })
  }

  deleteDialogOpen(delObj?: any) {
    let dialogObj = {
      title: 'Do You Want To Delete Selected Feeder',
      header: 'Delete Feeder',
      okButton: 'Delete',
      cancelButton: 'Cancel',
      headerImage: 'assets/images/delete.svg'
    };
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data: dialogObj,
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
      this.deleteFeeder(delObj)
      }
    });
  }

  deleteFeeder(obj:any){
    this.apiService.setHttp('DELETE', 'MSEB_iOT/api/Feeder/DeleteFeeder?Id=' + obj.feederId, false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.commonMethod.snackBar(res.statusMessage, 0);
          this.getAllFeeder();
        } else {
          this.commonMethod.snackBar(res.statusMessage, 1);
        }
      },
      error: (error: any) => {
        this.errorService.handelError(error.statusCode);
      },
    });
  }


}
