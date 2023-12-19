import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { CommonMethodsService } from '../services/common-methods.service';
import { WebStorageService } from '../services/web-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoggedInGuard implements CanActivate {
  constructor(private webStorageService:WebStorageService,
      private commonMethodService:CommonMethodsService){}
      
  canActivate(){
    if(this.webStorageService.checkUserIsLoggedIn()){
      this.commonMethodService.routerLinkRedirect('/dashboard');
      return false;
    }else{
      return true;
    }
  }
}
