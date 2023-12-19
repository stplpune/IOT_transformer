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

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [CommonMethodsService, ApiService, ErrorsService],
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent {

deviceForm:FormGroup | any;

  constructor(
    private apiService: ApiService,
    public commonService: CommonMethodsService,
    private errorService: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
    public webStorageService: WebStorageService,
    private dialogRef: MatDialogRef<AddDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.device_Form();
    this.data ? this.editData() : '';
  }

  get f(){return this.deviceForm.controls}
  device_Form() {
    this.deviceForm = this.fb.group({
      id: [0],
      deviceId: ['', [Validators.required]]
    })
  }

   onSubmit() {
    if (this.deviceForm.invalid) {
      return;
    }
    else {
      let formData = this.deviceForm.getRawValue();
      let Addobj = {
          "deviceId": formData?.deviceId,
          // "createdBy": this.webStorageService.getUserId()
          "createdBy": this.webStorageService.userId
      }

      let UpdateObj = {
        "deviceId": formData?.deviceId,
        "modifiedBy": this.webStorageService.userId,
        "id": +formData?.id
    }

      let Url = this.data ? 'MSEB_iOT/api/Device/UpdateDevice' : 'MSEB_iOT/api/Device/AddDevice';
      this.apiService.setHttp(this.data ? 'put' : 'post', Url , false, (this.data ? UpdateObj : Addobj), false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.commonService.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.device_Form();
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
    this.deviceForm.patchValue({
      id: this.data.deviceId,
      deviceId: this.data.deviceName
    })
  }

}
