import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-page-right-access',
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
    MatSlideToggleModule
  ],
  providers: [CommonMethodsService, ApiService, ErrorsService, DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './page-right-access.component.html',
  styleUrls: ['./page-right-access.component.scss']
})
export class PageRightAccessComponent {
  dataSource: any;
  totalRows: any;
  displayedColumns = ['srNo', 'pageName', 'add', 'update', 'view', 'delete', 'all']
  TextSearch = new FormControl('');

  constructor(
    private apiService: ApiService,
    public commonService: CommonMethodsService,
    private spinner: NgxSpinnerService,
    private errorService: ErrorsService,
    public validation: ValidationService
  ) {}

  ngOnInit(): void {
    this.getPagesAccessList();
  }

  getPagesAccessList() {
    this.spinner.show();
    let queryParam = '';
    queryParam = '?UserTypeId=' + 1 + '&Textsearch=' + this.TextSearch.value?.trim();
    this.apiService.setHttp('GET', 'MP/UserPage/GetByCriteria' + queryParam, false, false, false, 'MPDSSBaseUrl')
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        this.spinner.hide();
        if (res.statusCode == 200) {
          this.dataSource = res?.responseData;
        } else {
          this.dataSource = [];
          this.totalRows = 0;
        }
      },
      error: ((err: any) => { this.spinner.hide(), this.errorService.handelError(err), this.dataSource = []; })
    });
  }

  selectRow(event: any, i: any) {
    let allStatus: any = event.checked ? true : false;
    this.dataSource[i].addFlag = allStatus;
    this.dataSource[i].viewFlag = allStatus;
    this.dataSource[i].updateFlag = allStatus;
    this.dataSource[i].deleteFlag = allStatus;
  }

  onSubmit() {
    this.spinner.show();
    let pageAccessArray = new Array();
    let tableData = this.dataSource;

    tableData.map((ele: any) => {
      let obj = {
        createdBy: 0,
        modifiedBy: 0,
        createdDate: new Date(),
        modifiedDate: new Date(),
        isDeleted: false,
        id: ele.id || 0,
        userTypeId: 1,
        pageId: ele.pageId,
        addFlag: ele.addFlag,
        updateFlag: ele.updateFlag,
        viewFlag: ele.viewFlag,
        deleteFlag: ele.deleteFlag
      }
      pageAccessArray.push(obj);
    })

    this.apiService.setHttp('post', 'MP/UserPage/AddRecord', false, pageAccessArray, false, 'MPDSSBaseUrl');
    this.apiService.getHttp().subscribe({
      next: ((res: any) => {
        this.spinner.hide();
        if (res.statusCode == 200) {
          this.commonService.snackBar(res.statusMessage, 0);
          this.getPagesAccessList();
        } else {
          this.commonService.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      })
    })
  }

}

