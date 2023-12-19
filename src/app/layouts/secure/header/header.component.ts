import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { GlobalDialogComponent } from 'src/app/shared/components/global-dialog/global-dialog.component';
import { CommonMethodsService } from 'src/app/core/services/common-methods.service';
import { ChangePasswordComponent } from 'src/app/shared/components/change-password/change-password.component';
import { filter } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers:[MatDialog],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  titleName:any;

  constructor( 
    private dialog: MatDialog,
    private commonMethods:CommonMethodsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.setGlobalTitle();
  }
  

  ngOnInit(): void {
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '50%',
      data: '',
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == 'Yes') {
        this.clearLocalStorage();
      }
    });
  }

  logOut(){
    let dialogObj ={
      header : 'Logout',
      title : 'Do You Want To Logout ?',
      cancelButton : 'Cancel',
      okButton : 'Logout'
      
    }
    const dialogRef = this.dialog.open(GlobalDialogComponent, {
      width: '30%',
      data:dialogObj,
      disableClose : false
    })
    dialogRef.afterClosed().subscribe(res => {
      if(res == 'Yes'){
        this.clearLocalStorage();
      }
    })
  }

  clearLocalStorage() {
    localStorage.clear();
    sessionStorage.removeItem('loggedIn');
    this.commonMethods.routerLinkRedirect('/login');
  }

  setGlobalTitle() {
    this.router.events.pipe(filter((event:any) => event instanceof NavigationEnd),  // set title dynamic
    ).subscribe(() => {
      var rt = this.getActivatedRoute(this.activatedRoute);
      this.titleName = rt?.data._value?.breadcrumb[rt.data?._value?.breadcrumb?.length - 1]?.title;
    });
  }
  
  getActivatedRoute(activatedRoute: ActivatedRoute): any {
    if (activatedRoute.firstChild) {
      return this.getActivatedRoute(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }


}
