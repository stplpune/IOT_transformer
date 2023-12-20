import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import * as CryptoJS from 'crypto-js';
import {   Subject } from 'rxjs';
import { CommonMethodsService } from './common-methods.service';
@Injectable({
  providedIn: 'root'
})
export class WebStorageService {

  userTypeId!: number;
  userId!: number | string;
  districtId!: number | string;
  talukaId!: number | string;
  stateId!: number;
  mobileNo !:string;
  userName!:string;

  secretKey = "8080808080808080";

  constructor(public router:Router,
    private commomMethod:CommonMethodsService) {
     }
  setuId!:number;
  setLanguage = new Subject();

  checkUserIsLoggedIn() {
    if (sessionStorage.getItem('loggedIn'))
      return true
    else return false
  }

  getLocalStorageData() {
    if (this.checkUserIsLoggedIn() == true) {
      var decryptData = JSON.parse(
        this.commomMethod.decrypt(localStorage['loggedInData'])
      );
      let data = decryptData;
      return data;
    }
  }

  assignLocalStorageData() {
    let data: any = this.getLocalStorageData();
    this.userTypeId = data.userTypeId;
    this.userId = data.id;
    this.userName = data.userName;
    this.stateId = data.stateId;
    this.districtId = data.districtId;
    this.talukaId = data.talukaId;
    this.mobileNo = data.mobileNo;
  }

  getAllPageName() {
    if (this.checkUserIsLoggedIn() == true) {
      let getAllPageName = JSON.parse(this.getLocalStorageData());
      return getAllPageName.pageLstModels;
    }
  }

  createdByProps(creBy?:any,creDate?:any): any {
    this.assignLocalStorageData();
    return {
      "createdBy":creBy ? creBy :this.userId ,
      "createdDate":creDate ? creDate: new Date(),
      "isDeleted": false
    }
  }

  createdByObj(creBy?:any, creDate?:any) {
    this.assignLocalStorageData();
    return {
      "createdBy":creBy ? creBy:this.userId,
      "modifiedBy": this.userId,
      "createdDate":creDate ? creDate: new Date(),
      "modifiedDate": new Date(),
      "isDeleted": false,
    }
  }
}
