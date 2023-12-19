

import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  providers: [CommonMethodsService,ApiService,ErrorsService,DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true;
  loginForm!: FormGroup;
  loginData:any;

  constructor(private fb: FormBuilder,
    private commonService :CommonMethodsService,
    private apiService: ApiService,
    private errorService: ErrorsService,
    public validationService: ValidationService,
    private spinner: NgxSpinnerService,
    public router: Router,) { }

  ngOnInit() {
    this.defultForm();
   }

   ngAfterViewInit() {
    this.generateCaptcha();
  }

  defultForm(){
    this.loginForm = this.fb.group({
      userName:['',Validators.required],
      password:['',[Validators.required, Validators.pattern(this.validationService.password)]],
      captcha:['',[Validators.required, Validators.maxLength(4), Validators.minLength(4)]],
    })
  }

  get loginFC() { return this.loginForm.controls}

  generateCaptcha() {
    this.loginForm.controls['captcha'].setValue('');
    this.commonService.createCaptchaCarrerPage();
  }

  onSubmit(){
    let formValue = this.loginForm.value
    let submitObj = {
      userName: this.loginForm.value.userName,
      password: this.loginForm.value.password
    }
    if(this.loginForm.invalid){ return }
    if ( formValue.captcha != this.commonService.checkvalidateCaptcha()) {
      this.commonService.snackBar('Invalid Captcha', 1);
      this.generateCaptcha();
      return
    }
    this.spinner.show();
    this.apiService.setHttp('POST', 'MSEB_iOT/api/User/UserLogin', true, submitObj, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if(res.statusCode == 200){
          this.spinner.hide();
          this.commonService.snackBar(res.statusMessage, 0);
          sessionStorage.setItem('loggedIn', 'true');
          this.loginData = this.commonService.encrypt(JSON.stringify(res.responseData));
          localStorage.setItem('loggedInData', this.loginData);
          this.router.navigate(['dashboard'])
        }else{
          this.spinner.hide();
          !this.commonService.checkEmptyData(res.statusMessage) ? this.errorService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
        }
      },
      error: (err: any) => {
        this.spinner.hide();
        this.errorService.handelError(err.status); }
    })

  }
}
