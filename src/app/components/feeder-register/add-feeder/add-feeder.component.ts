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
import { MasterService } from 'src/app/core/services/master.service';

@Component({
  selector: 'app-add-feeder',
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
    MatSelectModule,
  ],
  providers: [CommonMethodsService, ApiService, ErrorsService],
  templateUrl: './add-feeder.component.html',
  styleUrls: ['./add-feeder.component.scss']
})
export class AddFeederComponent {

  feederForm:FormGroup | any;
  substationArray: any;

  constructor(
    public apiService: ApiService,
    public commonService: CommonMethodsService,
    private errorService: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
    private masterService: MasterService,
    public webStorageService: WebStorageService,
    private dialogRef: MatDialogRef<AddFeederComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.webStorageService.assignLocalStorageData();
    this.feeder_Form();
    this.getSubstation();
    this.data ? this.editData() : '';
  }

  get f(){return this.feederForm.controls}
  feeder_Form() {
    this.feederForm = this.fb.group({
      id: [0],
      feederName: ['', [Validators.required, Validators.pattern('^[^[ ]+|[ ][gm]+$')]],
      substationId: ['', [Validators.required]],
    })
  }

  getSubstation() {
    this.substationArray = [];
    this.masterService.GetSubStation().subscribe({
      next: ((res: any) => {
        this.substationArray = res.responseData;
      }), error: (() => { this.substationArray = []})
    })
  }

   onSubmit() {
    if (this.feederForm.invalid) {
      return;
    }
    else {
      let formData = this.feederForm.getRawValue();
      let Addobj = {
        "id": formData.id,
        "feederName": formData.feederName,
        "substationId": formData.substationId,
        "createdBy": this.webStorageService.userId
      }

      let UpdateObj = {
        "id": formData.id,
        "feederName": formData.feederName,
        "substationId": formData.substationId,
        "modifiedBy": this.webStorageService.userId,
        "modifiedDate": new Date()
    }

      let Url = this.data ? 'MSEB_iOT/api/Feeder/UpdateFeeder' : 'MSEB_iOT/api/Feeder/AddFeeder';
      this.apiService.setHttp(this.data ? 'put' : 'post', Url , false, (this.data ? UpdateObj : Addobj), false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.commonService.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.feeder_Form();
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
    this.feederForm.patchValue({
      id: this.data.feederId,
      feederName: this.data.feederName,
      substationId: this.data.substationId,
    })
  }

}
