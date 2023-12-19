import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebStorageService } from '../services/web-storage.service';



@Injectable({
  providedIn: 'root'
})
export class NoAuthGuardService {
  constructor(private webStorage: WebStorageService,
    private router: Router ){
  }
  logInUserType:any =  localStorage.getItem('loggedInDetails');

    canActivate(): any {
      if(this.webStorage.checkUserIsLoggedIn()){
        let getUrlPath = this.webStorage.getAllPageName();
        this.router.navigate([getUrlPath[0].pageURL])
      }else{
        return true;
      }
    }
}
