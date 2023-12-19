import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(
    private apiService: ApiService,
  ) { }

  GetSubStation() {
    return new Observable((obj) => {
      this.apiService.setHttp('GET', 'MSEB_iOT/api/CommonDropDown/GetSubStation', false, false, false, 'baseUrl')
      this.apiService.getHttp().subscribe({
        next: (res: any) => { if (res.statusCode == "200") { obj.next(res) } else { obj.error(res); } },
        error: (e: any) => { obj.error(e) }
      })
    })
  }

}

