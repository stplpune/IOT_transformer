import { Component, ElementRef, Inject, NgZone, ViewChild } from '@angular/core';
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
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { MasterService } from 'src/app/core/services/master.service';

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
    MatSelectModule,
    AgmCoreModule
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
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public commonService: CommonMethodsService,
    private masterService:MasterService,
    private errorService: ErrorsService,
    public validation: ValidationService,
    private fb: FormBuilder,
    public webStorageService: WebStorageService,
    private dialogRef: MatDialogRef<AddTransformerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    this.webStorageService.assignLocalStorageData();
    this.transformerFormGroup();
    this. getDevice();
    this.getSubstation();
    this.getFeeder();
    this.data ? this.editData() : '';
  }
  
  transformerFormGroup() {
    this.transformerForm = this.fb.group({
      transformerName: ['', [Validators.required]],
      deviceMasterId: ['', [Validators.required]],
      substationId: ['', [Validators.required]],
      feederId: ['', [Validators.required]],  
      address:['']    
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
    this.substationArray = [];
    this.masterService.GetSubStation().subscribe({
      next: ((res: any) => {
        this.substationArray = res.responseData;
      }), error: (() => { this.substationArray = []})
    })
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
    else if(!this.latitude){
      this.commonService.snackBar("Please Select Address", 1);
    } else {
      let formData = this.transformerForm.getRawValue();
      let obj:any = {
        "id": this.data ? this.data?.transformerId : 0,
        "transformerName": formData.transformerName,
        "deviceMasterId": formData.deviceMasterId,
        "substationId": formData.substationId,
        "feederId": formData.feederId,
        "address":formData.address,
        "lat": this.latitude,
        "long": this.longitude,   
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
    this.transformerForm.patchValue(this.data);
    this.latitude = this.data.lat;
    this.longitude = this.data.long;
  }

    //...........................................  Map Code Start Here .....................................//

    geoCoder:any;
    map:any;
    zoom = 6;
    latitude:any;
    longitude:any;
    @ViewChild('search') public searchElementRef!: ElementRef;
  
    onMapReady(map?: any) {
      map?.setOptions({ mapTypeControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT },streetViewControl: false, 
        zoomControl: true, fullscreenControl: true, disableDefaultUI: false, mapTypeControl: true});
      this.map = map;
      this.agmMapLoad();
    }
  
  agmMapLoad(){
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      let options = {types: ['address'],componentRestrictions: {country: "IN" }};
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, options);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {return}
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.getAddress(this.latitude, this.longitude);
        });
      });
    });
  }
  
  markerDragEnd($event: any) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
    this.searchElementRef.nativeElement = '';
  }
  
  addMarker(event: any) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  
  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 15;
          this.f['address'].setValue(results[0].formatted_address);
        } else {  window.alert('No results found')}
      } else { window.alert('Geocoder failed due to: ' + status);}});
  }
  
   //...........................................  Map Code End Here .....................................//


}
