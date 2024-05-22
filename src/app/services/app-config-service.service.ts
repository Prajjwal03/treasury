import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigServiceService {
  private _startupData: any;
  static settings: any;

  constructor(private http: HttpClient) {
  }

  load() {
    const jsonFile = '../../EPIXTreasuryConfiguration/Configuration';
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: any) => {
        AppConfigServiceService.settings = response;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load the config file`);
      });
    })
  }
}
