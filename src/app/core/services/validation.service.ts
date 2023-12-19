import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  singleName = ('^[a-zA-Z]+$');
  numberAccept = ('^[0-9]+$');
  fullName = ('^[a-zA-Z][a-zA-Z ]*$');
  email = ('^[a-zA-Z0-9][a-zA-Z0-9._-]+[a-zA-Z0-9]+@([a-z.]+[.])+[a-z]{2,5}$');
  mobile_No = ('[6-9]\\d{9}');
  aadhar_card = ('^[2-9][0-9]{11}$');
  pan_card =('[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}');
  password =('^(?=.*[a-z0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&#])[A-Za-z0-9 \d@$!%*?&#]{8,20}$');
  latitude =('^[+-]?(([1-8]?[0-9])(\.[0-9]{1,8})?|90(\.0{1,8})?)$');
  longitude =('^[+-]?((([1-9]?[0-9]|1[0-7][0-9])(\.[0-9]{1,8})?)|180(\.0{1,8})?)$');
  pin_code =('^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$');
  alphanumeric =('^[^\\s\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z0-9.\\s]+$');
  valGstNo = '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$';
  panValidationV1 = '[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}';
  newEmail = '^([a-z0-9]+(?:[._-][a-z0-9]+)*)@([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})$';
  name = '^[^\\s0-9\\[\\[`&._@#%*!+"\'\/\\]\\]{}][a-zA-Z.\\s]+$'; // fname, mname, lname
  panNumber = '[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}';

  alphabetsWithSpaces(event: any) {
    this.noFirstSpaceAllow(event);
    const maskSeperator = new RegExp('^([a-zA-Z ])', 'g');
    return maskSeperator.test(event.key);
  }

  onlyAlphabetsWithSpace(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z])', 'g');
    return maskSeperator.test(event.key);
  }
  noSpacesAtStart(event: any) {
    const maskSeperator = new RegExp('^[ ]+|[ ]+$', 'm');
    return !maskSeperator.test(event.key);
  }

  onlyDigits(event: any) {
    const maskSeperator = new RegExp('^([0-9])', 'g');
    return maskSeperator.test(event.key);
  }
  digitsWithDec(event: any) {
    const maskSeperator = new RegExp('^([0-9.])', 'g');
    return maskSeperator.test(event.key);
  }

  surveyNoVal(event: any){
    if (!this.noSpacesAtStart(event)) {
      return false
    }
    const maskSeperator = new RegExp('^([a-zA-Z0-9/])', 'g');
    return maskSeperator.test(event.key);
  }

  applicationId(event: any){
    if (!this.noSpacesAtStart(event)) {
      return false
    }
    const maskSeperator = new RegExp('^([a-zA-Z0-9/-])', 'g');
    return maskSeperator.test(event.key);
  }

  onlyDigitsExcludeZeroAtStart(event: any) {
    const maskSeperator = new RegExp('^[1-9][0-9]*$', 'g')
    return maskSeperator.test(event.key);
}

  onlyAlphabets(event: any) {
    if (!this.noSpacesAtStart(event)) {
      return false
    }
    const maskSeperator = new RegExp('^([a-zA-Z])', 'g');
    return maskSeperator.test(event.key);
  }

  removeSpaceAtBegining(event: any) {
    let temp = true;
    try {
      if (!event.target.value[0].trim()) {
        event.target.value = event.target.value.substring(1).trim();
        temp = false;
      }
    }
    catch (e) {
      temp = false;
    }
    return temp
  }

  unicodeMarathiValidation(event: any) {
    const maskSeperator = new RegExp('[^\u0900-\u0965 ]+', 'm');
    return !maskSeperator.test(event.key);
  }

  emailRegex(event: any) { //Email Validation
    if (!this.noSpacesAtStart(event)) return false; // First Space not Accept
    if (event.currentTarget.value.split('..').length - 1 == 1 && (event.keyCode == 46)) return false;  // double .Dot not accept
    if (event.currentTarget.value.split('@').length - 1 == 1 && (event.keyCode == 64)) return false;  // double @ not accept
    if (event.target.selectionStart === 0 && (event.keyCode == 46)) return false;  // starting .Dot not accept
    if (event.target.selectionStart === 0 && (event.keyCode == 64)) return false;  // starting @ not accept
    const maskSeperator = new RegExp('^([a-zA-Z0-9 .@_-])', 'g'); // only Accept A-Z & 0-9 & .@
    return maskSeperator.test(event.key);
  }

  alphaNumeric(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9])', 'g');
    return maskSeperator.test(event.key);
  }
  onlyCharacters(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z ])', 'g');
    return maskSeperator.test(event.key);
  }

  noFirstSpaceAllow(event: any) {  // for First Space Not Allow
    if (event.target.selectionStart === 0 && (event.code === 'Space')) {
      event.preventDefault();
    }
  }
  alphaNumericWithSpaces(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 ])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithSpacesAndSpecChars(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 (,)+-@#$_])', 'g');
    return maskSeperator.test(event.key);
  }

  alphaNumericWithSpacesDocComma(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 (,).])', 'g');
    return maskSeperator.test(event.key);
  }
  alphaNumericWithSlash(event: any) {
    const maskSeperator = new RegExp('^([a-zA-Z0-9 /])', 'g');
    return maskSeperator.test(event.key);
  }

  noSpaceAllow(event: any) {  // for All Space Not Allow
    if (event.code === 'Space') {
        event.preventDefault();
    }
  }

  onlyDigitsWithDec(event: any) {
    const maskSeperator = new RegExp('^([0-9.])', 'g');
    return maskSeperator.test(event.key);
  }

  singleDotAmount(event: any) {
    if (event.currentTarget.value.split('.').length - 1 == 1 && (event.keyCode == 46)) return false;  // double . not accept
    const maskSeperator = new RegExp('^([0-9.])', 'g');
    return maskSeperator.test(event.key);
  }

  acceptedOnlyNumbers(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  isValidPanCardNo(panCardNo: any) {
    let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
    if (panCardNo == null || panCardNo == '') return false;
    if (regex.test(panCardNo)) return true; else return false;
  }

  isValidAadharNo(aadharNo: any) {
    let regex = new RegExp(/^[2-9][0-9]{11}$/);
    if (aadharNo == null || aadharNo == '') return false;
    if (regex.test(aadharNo)) return true; else return false;
  }

  isValidGSTNo(gstNo: any) {
    let regex = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);//29GGGGG1314R9Z6
    if (gstNo == null || gstNo == '') return false;
    if (regex.test(gstNo)) return true; else return false;
  }

  isValidalphaNumeric(string: any, _cout?:number) {
    let regex:any =  new RegExp(/^[a-zA-Z0-9]{10,15}$/);
    if (string == null || string == '') return false;
    if (regex.test(string)) return true; else return false;
  }

  isValidaonlyDigits(string: any) {
    let regex =  new RegExp(/^[0-9]{8,12}$/);
    if (string == null || string == '') return false;
    if (regex.test(string)) return true; else return false;
  }
  percentage(event: any) {
    if (event.target.selectionStart === 0 && (event.keyCode == 46)) return false;  // starting .Dot not accept
    if (event.currentTarget.value.split('.').length - 1 == 1 && (event.keyCode == 46)) return false;  // double .Dot not accept
    
    if (event.target.selectionStart === 0 && (event.keyCode == 53 + event.shift)) return false;  // starting ,semi not accept
    
    const maskSeperator = new RegExp('^([0-9.])', 'g');
    return maskSeperator.test(event.key);
  }
 
  singleDot_RemoveFirstDotAmount(event: any) {
    if (event.target.selectionStart === 0 && (event.keyCode == 46)) return false;  // starting .Dot not accept
    return this.singleDotAmount(event);
  }
 
}
