import { Component, ElementRef, Inject, NgZone, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ConfigService } from 'src/app/core/services/config.service';
import { AgmCoreModule, MapsAPILoader } from '@agm/core';
import { MasterService } from 'src/app/core/services/master.service';
@Component({
  selector: 'app-add-substation',
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
    FormsModule,
    AgmCoreModule,
  ],
  providers: [CommonMethodsService, ApiService, ErrorsService, ConfigService],
  templateUrl: './add-substation.component.html',
  styleUrls: ['./add-substation.component.scss']
})
export class AddSubstationComponent {

  substationForm: FormGroup | any;
  // granpanchayatArray:any
  stateArray:any;
  districtArray:any;
  talukaArray:any;
  villageArray:any;

  constructor(
    private apiService: ApiService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private configSer:ConfigService,
    public commonService: CommonMethodsService,
    private errorService: ErrorsService,
    public validation: ValidationService,
    private masterService:MasterService,
    private fb: FormBuilder,
    public webStorageService: WebStorageService,
    private dialogRef: MatDialogRef<AddSubstationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.webStorageService.assignLocalStorageData();
    this.substation_Form();
    this.get_State();
    this.data ? this.editData() : '';
  }

  get f() { return this.substationForm.controls }
  substation_Form() {
    this.substationForm = this.fb.group({
      id: [0],
      substationName: ['', [Validators.required, Validators.pattern('^[^[ ]+|[ ][gm]+$')]],
      // granpanchayatId: ['', [Validators.required]],
      address:[''],

      stateId:[this.configSer.stateId, [Validators.required]],
      districtId:['', [Validators.required]],
      talukaId:['', [Validators.required]],
      villageId:['', [Validators.required]],
    })
  }

  get_State() {
    this.stateArray = [];
    this.masterService.getState().subscribe({
      next: ((res: any) => {
        this.stateArray = res.responseData;
        this.get_District();
      }), error: (() => { this.stateArray = []})
    })
  }

  get_District() {
    this.districtArray = [];
    this.masterService.getDistrict(this.f['stateId'].value).subscribe({
      next: ((res: any) => {
        this.districtArray = res.responseData;
        // this.get_Taluka();
      }), error: (() => { this.districtArray = []})
    })
  }

  get_Taluka() {
    this.talukaArray = [];
    this.masterService.getTaluka(this.f['districtId'].value).subscribe({
      next: ((res: any) => {
        this.talukaArray = res.responseData;
        // this.get_Village();
      }), error: (() => { this.talukaArray = []})
    })
  }

  get_Village() {
    this.villageArray = [];
    this.masterService.getVillage(this.f['talukaId'].value).subscribe({
      next: ((res: any) => {
        this.villageArray = res.responseData;
      }), error: (() => { this.villageArray = []})
    })
  }

  clearFilter(flag:any){
    if(flag == 'district'){
      this.f['talukaId'].setValue('');
      this.f['villageId'].setValue('');
    } else if(flag == 'taluka'){
      this.f['villageId'].setValue('');
    } 
  }

  onSubmit() {
    if (this.substationForm.invalid) {
      return;
    } 
    else if(!this.latitude){
      this.commonService.snackBar("Please Select Address", 1);
    } 
    else {
      let formData = this.substationForm.getRawValue();

      let obj: any = {
        "id": formData.id,
        "substationName": formData.substationName,
        "granpanchayatId": formData.villageId,
        "address":formData.address,
        "lat": this.latitude,
        "long": this.longitude,
      }

      this.data ? obj = { ...obj, "modifiedBy": this.webStorageService.userId, "modifiedDate": new Date() } :
        obj = { ...obj, "createdBy": this.webStorageService.userId, "createdDate": new Date(), "isdeleted": false }

      let Url = this.data ? 'MSEB_iOT/api/Substation/UpdateSubstation' : 'MSEB_iOT/api/Substation/AddSubstation';
      this.apiService.setHttp(this.data ? 'put' : 'post', Url, false, obj, false, 'baseUrl');
      this.apiService.getHttp().subscribe({
        next: ((res: any) => {
          if (res.statusCode == "200") {
            this.commonService.snackBar(res.statusMessage, 0);
            this.dialogRef.close('Yes');
            this.substation_Form();
          } else {
            this.commonService.checkEmptyData(res.statusMessage) == false ? this.errorService.handelError(res.statusCode) : this.commonService.snackBar(res.statusMessage, 1);
          }
        }), error: (error: any) => {
          this.errorService.handelError(error.statusCode);
        }
      });
    }
  }

  editData() {
    this.substationForm.patchValue({
      id: this.data.substationId,
      substationName: this.data.substationName,
      address: this.data.address,
      stateId: this.data.stateId,
      districtId: this.data.districtId,
      talukaId: this.data.talukaId,
      villageId: this.data.granpanchayatId,
    })
    // this.getAddress(this.data.lat,this.data.long);
    this.latitude = this.data.lat;
    this.longitude = this.data.long;

    this.get_Taluka();
    this.get_Village();
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


