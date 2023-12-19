import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from 'src/app/core/services/api.service';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ErrorsService } from 'src/app/core/services/errors.service';
import { ValidationService } from 'src/app/core/services/validation.service';
import { WebStorageService } from 'src/app/core/services/web-storage.service';

@Component({
  selector: 'app-add-transformer',
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
  templateUrl: './add-transformer.component.html',
  styleUrls: ['./add-transformer.component.scss']
})
export class AddTransformerComponent {

  transformerForm:FormGroup | any;
  substationArray: any;
  deviceArray: any;
  feederArray: any;

  constructor(
    private apiService: ApiService,
    public commonService: CommonMethodsService,
    private errorService: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
    public webStorageService: WebStorageService,
    private dialogRef: MatDialogRef<AddTransformerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    this.transformerFormGroup();
    this. getDevice();
    this.getSubstation();
    this.getFeeder();
    console.log(this.data);
    
    this.data ? this.editData() : '';
  }
  
  transformerFormGroup() {
    this.transformerForm = this.fb.group({
      transformerName: ['', [Validators.required]],
      deviceMasterId: ['', [Validators.required]],
      substationId: ['', [Validators.required]],
      feederId: ['', [Validators.required]],      
    })
  }

  get f(){return this.transformerForm.controls}

  getDevice() {
    this.apiService.setHttp('GET', 'MSEB_iOT/api/CommonDropDown/GetDevice', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.deviceArray = res.responseData;
        } else { this.deviceArray = [] }
      }, error: (err: any) => {this.deviceArray = []; this.errorService.handelError(err.status) },
    });
  }

  getSubstation() {
    this.apiService.setHttp('GET', 'MSEB_iOT/api/CommonDropDown/GetSubStation', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.substationArray = res.responseData;
        } else { this.substationArray = [] }
      }, error: (err: any) => {this.substationArray = []; this.errorService.handelError(err.status) },
    });
  }

  getFeeder() {
    this.apiService.setHttp('GET', 'MSEB_iOT/api/CommonDropDown/GetFeeder', false, false, false, 'baseUrl');
    this.apiService.getHttp().subscribe({
      next: (res: any) => {
        if (res.statusCode == '200') {
          this.feederArray = res.responseData;
        } else { this.feederArray = [] }
      }, error: (err: any) => {this.feederArray = []; this.errorService.handelError(err.status) },
    });
  }

  onSubmit() {
    if (this.transformerForm.invalid) { return; }
    else {
      let formData = this.transformerForm.getRawValue();
      let obj:any = {
        "id": this.data ? this.data?.transformerId : 0,
        "transformerName": formData.transformerName,
        "deviceMasterId": formData.deviceMasterId,
        "substationId": formData.substationId,
        "feederId": formData.feederId,
        "lat": 18.3696,
        "long": 19.3696,       
      }
      this.data ? obj.modifiedBy = this.webStorageService.userId : obj.createdBy = this.webStorageService.userId
      
      let Url = this.data ? 'MSEB_iOT/api/Transformer/UpdateTransformer' : 'MSEB_iOT/api/Transformer/AddTransformer';
      this.apiService.setHttp(this.data ? 'put' : 'post', Url , false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.commonService.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.transformerFormGroup();
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
    this.transformerForm.patchValue(this.data)
  }


}
