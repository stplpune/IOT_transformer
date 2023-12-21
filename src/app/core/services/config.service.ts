import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {


  stateId = 1;
  lat = 19.0898177;
  lng = 76.5240298;
  zoom: number = 8;

  static googleApiObj: object = { // google api key
    // apiKey: 'AIzaSyBhkYI4LMEqVhB6ejq12wpIA6CW5theKJw', //live
    apiKey: 'AIzaSyAkNBALkBX7trFQFCrcHO2I85Re2MmzTo8', //demo
    language: 'en',
    libraries: ['drawing', 'places']
  };

  constructor() { }
}
