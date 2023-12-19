import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'IOT_transformer';

  constructor(private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
  ) {
    this.setGlobalTitle();
  }

  setGlobalTitle() {
    this.router.events.pipe(filter((event:any) => event instanceof NavigationEnd),  // set title dynamic
    ).subscribe(() => {
      var rt = this.getActivatedRoute(this.activatedRoute);
      let titleName = rt?.data._value?.breadcrumb[rt.data?._value?.breadcrumb?.length - 1]?.title;
      rt.data.subscribe(() => {
        this.titleService.setTitle(titleName)
      })
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
