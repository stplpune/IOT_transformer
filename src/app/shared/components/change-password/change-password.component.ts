import { Component, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef } from '@angular/material/dialog';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from 'src/app/core/services/api.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,MatIconModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatSnackBarModule,HttpClientModule, MatDialogModule],
  templateUrl: './change-password.component.html',
  providers: [CommonMethodsService,ApiService,ErrorsService, WebStorageService,DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {

  changePassForm!: FormGroup;
  currentPasshide: boolean = true;
  newPasshide : boolean = true;
  confirmPasshide :boolean = true;
  @ViewChild('formDirective') formDirective!: NgForm;
  loginUser : any;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private fb: FormBuilder,
    public validation: ValidationService,
    private apiService: ApiService,
    private error: ErrorsService,
    private webStorage: WebStorageService,
    private commonMethods:CommonMethodsService
  ) { }

  ngOnInit() {
    this.loginUser = this.webStorage.getLocalStorageData();
    this.defaultForm();
  }

  get f() {
    return this.changePassForm.controls;
  }

  defaultForm() {
    this.changePassForm = this.fb.group({
      currentPass: ['', [Validators.required, Validators.pattern(this.validation.password)]],
      newPass: ['', [Validators.required, Validators.pattern(this.validation.password)]],
      confirmPass: ['', [Validators.required, Validators.pattern(this.validation.password)]],
    })
  }


  onSubmit(){
    let formData = this.changePassForm.value;
    if (this.changePassForm.invalid) {
      return;
    } else if (formData.newPass !== formData.confirmPass) {
      this.commonMethods.snackBar("New Password And Comfirm Password Not Match", 1);
      return;
    } else if (formData.currentPass == formData.newPass) {
      this.commonMethods.snackBar("The Entered Old Password is the Same as the New Password", 1);
    } else {
      let obj = {
        "id": this.loginUser.id,
        "newPassword": formData.newPass,
        "oldPassword": formData.currentPass
      }

      this.apiService.setHttp('post', 'MSEB_iOT/api/User/ResetPassword', false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe((res: any) => {
        if (res.statusCode == 200) {
          this.commonMethods.snackBar(res.statusMessage, 0);
          this.formDirective?.resetForm();
          this.dialogRef.close('Yes');
        }
        else {
          this.commonMethods.checkEmptyData(res.statusMessage) == false ? this.error.handelError(res.statusCode) : this.commonMethods.snackBar(res.statusMessage, 1);
        }
      }, (error: any) => {
        this.error.handelError(error.status);
      })
    }


  }

  clearFormData() { // for clear Form field
    this.formDirective?.resetForm();
    this.defaultForm();
    this.currentPasshide = true;
    this.newPasshide = true;
    this.confirmPasshide = true;

  }

  closeDialogue(){
    this.dialogRef.close();
  }

}
