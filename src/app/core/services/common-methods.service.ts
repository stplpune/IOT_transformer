import { DatePipe, Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar, } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  codecareerPage: any;
  key: string = '8080808080808080';
  setLanguage = new Subject();

  constructor(private SnackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe, public location: Location,
    private activatedRoute: ActivatedRoute) { }


    encrypt(value: string): string {
      return CryptoJS.AES.encrypt(value, this.key).toString();
    }

    decrypt(value: string) {
      return CryptoJS.AES.decrypt(value, this.key.trim()).toString(
        CryptoJS.enc.Utf8
      );
    }

  snackBar(data: string, status: number) {
    let snackClassArr: any = ['snack-success', 'snack-danger', 'snack-warning'];
    this.SnackBar.open(data, " ", {
      duration: 3000,
      panelClass: [snackClassArr[status]],
      verticalPosition: 'top', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

  checkEmptyData(data: any) {
    let value: any;
    if (data == "" || data == null || data == "null" || data == undefined || data == "undefined" || data == 'string' || data == null || data == 0 || data == "0001-01-01T00:00:00") {
      value = false;
    } else {
      value = true;
    }
    return value;
  }
  routerLinkRedirect(path: any) {
    this.router.navigate([path], { relativeTo: this.activatedRoute })
  }

  routerLinkRedirectParam(path: any, id: any) {
    this.router.navigate([path + '/' + id]);
  }

  // captcha
  createCaptchaCarrerPage() {
    let id: any = document.getElementById('captcha');
    id.innerHTML = "";
    // "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    var charsArray = "0123456789";
    var lengthOtp = 4;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      var index = Math.floor(Math.random() * charsArray.length + 0);
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = "captcha1";
    canv.width = 120;
    canv.height = 28;
    var ctx: any = canv.getContext("2d");
    ctx.font = "26px Arial";
    ctx.fillText(captcha.join(""), 40, 28);
    this.codecareerPage = captcha.join("");
    let appendChild: any = document.getElementById("captcha");
    appendChild.appendChild(canv);
  }

  checkvalidateCaptcha() {
    return this.codecareerPage;
  }

  dateWithTimeFormat(dateTime: any) { // 2022-05-11T13:01:46.067Z
    let dateWithTime = this.datePipe.transform(dateTime, 'yyyy-MM-dd' + 'T' + 'hh:mm:ss.ms');
    return dateWithTime + "Z";
  }

  dateWithTimeFormat24Hours(dateTime: any) { // 2022-05-11T13:01:46.067Z
    let dateWithTime = this.datePipe.transform(dateTime, 'yyyy-MM-dd' + 'T' + 'HH:mm:ss.ms');
    return dateWithTime + "Z";
  }

  dateFormat(dateTime: any) { // 2022-05-11
    let date = this.datePipe.transform(dateTime, 'yyyy-MM-dd');
    return date;
  }

  sevenDaysValidation(fromDate: string, toDate: string) {
    let date1: any = new Date(fromDate);
    let timeStamp = Math.round(new Date(toDate).getTime() / 1000);
    let timeStampYesterday = timeStamp - (168 * 3600);
    let isSevendays = date1 >= new Date(timeStampYesterday * 1000).getTime();
    let val!: boolean;
    !isSevendays ? val = false : val = true
    return val;
  }

  findIndexOfArrayObject(array: any, key: any, val: any) { // find index of array object  [{'id:0',:name:'john'}, {'id:1',:name:'deo'}]
    let index = array.findIndex((x: any) => x[key] === val);
    return index
  }

  someOfArrayObject(array: any, key: any, val: any) {
    let flag = array.some((x: any) => x[key] === val);
    return flag
  }

  findIndexOfArrayValue(array: any, val: any) { // find index of array value [1,2,3,4]
    let index = array.indexOf(val);
    return index
  }

  // encryption(data: any) {
  //   let _key = CryptoJS.enc.Utf8.parse(this.key);
  //   let _iv = CryptoJS.enc.Utf8.parse(this.key);
  //   let encrypted = CryptoJS.AES.encrypt(
  //     data, _key, {
  //     keySize: 256 / 8,
  //     iv: _iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });
  //   return encrypted.toString();
  // }

  // decryption(data: any) {
  //   let _key = CryptoJS.enc.Utf8.parse(this.key);
  //   let _iv = CryptoJS.enc.Utf8.parse(this.key);
  //   return CryptoJS.AES.decrypt(
  //     data, _key, {
  //     keySize: 256 / 8,
  //     iv: _iv,
  //     mode: CryptoJS.mode.C  BC,
  //     padding: CryptoJS.pad.Pkcs7
  //   }).toString(CryptoJS.enc.Utf8);
  // }

  locationBack() {
    this.location.back();
  }
  getBeforeMonthDate() {
    let d = new Date();
    d.setDate(d.getDate() - 30);
    return this.dateFormat(d);
  }

  insertSpaces(string:any) {//Insert space before capital letters
    string = string?.replace(/([a-z])([A-Z])/g, '$1 $2');
    string = string?.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    return string;
}

  setDate(date: any) { // date format in toISOstring
    if (date) {
      let d = new Date(date);
      d.setHours(d.getHours() + 5);
      d.setMinutes(d.getMinutes() + 30);
      return d.toISOString();
    } else { return ''}
  }

}
