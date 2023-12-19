import { Injectable } from '@angular/core';
import {CanActivate} from '@angular/router';
import { CommonMethodsService } from '../services/common-methods.service';
import { WebStorageService } from '../services/web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private webStorageService:WebStorageService,
    public commonMethodService:CommonMethodsService){}

  canActivate(){
    if(!this.webStorageService.checkUserIsLoggedIn()){
      this.commonMethodService.routerLinkRedirect('/login');
      return false;
    } else {
      return true;
    }
  }
}
