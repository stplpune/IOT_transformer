import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ValidationService } from 'src/app/core/services/validation.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ApiService } from 'src/app/core/services/api.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers: [CommonMethodsService, ApiService, ErrorsService],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  userForm:FormGroup | any;
  substationArray: any;
  userTypeArray:any;

  constructor(
    private apiService: ApiService,
    public commonService: CommonMethodsService,
    private errorService: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
    public webStorageService: WebStorageService,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.user_Form();
    this.getSubstation();
    this.getUserType();
    this.data ? this.editData() : '';
  }

  get f(){return this.userForm.controls}
  user_Form() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      userTypeId: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      substationId: ['', [Validators.required]],
    })
  }

  getSubstation() {
    this.apiService.setHttp('GET', 'MSEB_iOT/api/CommonDropDown/GetSubStation', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.substationArray = res.responseData;
        } else { this.substationArray = [] }
      }, error: (err: any) => { this.errorService.handelError(err.status) },
    });
  }

  getUserType() {
    this.apiService.setHttp('GET', 'MSEB_iOT/api/CommonDropDown/GetUserType', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.userTypeArray = res.responseData;
        } else { this.userTypeArray = [] }
      }, error: (err: any) => { this.errorService.handelError(err.status) },
    });
  }

   onSubmit() {
    if (this.userForm.invalid) {
      return;
    }
    else {
      let formData = this.userForm.getRawValue();

      let obj:any = {
        "name": formData.name,
        "address": formData.address,
        "userTypeId": formData.userTypeId,
        "userName": formData.userName,
        "password": "",
        "substationId": formData.substationId,
        "createdBy": this.webStorageService.userId
      }

      this.data ? obj['userId'] = this.data?.userId : '';
      let Url = this.data ? 'MSEB_iOT/api/User/UpdateUsers' : 'MSEB_iOT/api/User/AddUsers';
      this.apiService.setHttp(this.data ? 'put' : 'post', Url , false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.commonService.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.user_Form();
          } else {
            this.commonService.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.errorService.handelError(error.statusCode);
        }
      });
    }
  }

  editData(){
    this.userForm.patchValue({
      name: this.data.name,
      address: this.data.address,
      userTypeId: this.data.userTypeId,
      userName: this.data.userName,
      substationId: this.data.substationId,
    })
  }

}

