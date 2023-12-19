import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebStorageService } from '../services/web-storage.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(private webStorageService: WebStorageService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let getUserId:any;
    if(this.webStorageService.checkUserIsLoggedIn()){
      this.webStorageService.assignLocalStorageData()
      getUserId = typeof (this.webStorageService?.userId) == 'number' ? (this.webStorageService?.userId).toString() : this.webStorageService?.userId;
    }
  // console.log("request",request.HttpRequest)
    const authReq = request.clone({ headers: request.headers.set('userid', getUserId ? getUserId : '0') });

    return next.handle(authReq)
  }
}
