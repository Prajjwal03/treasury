import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppConfigServiceService} from './app-config-service.service';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  BamReport_URL = AppConfigServiceService.settings.ServerURL.AppURL +
    AppConfigServiceService.settings.Report.BAMReportURL
  MyPerformance_URL = AppConfigServiceService.settings.ServerURL.AppURL + AppConfigServiceService.settings.Report.MyPerformance
  MyTeamPerformance_URL = AppConfigServiceService.settings.ServerURL.AppURL + AppConfigServiceService.settings.Report.MyTeamPerformance
  WIPGraphic_URL = AppConfigServiceService.settings.ServerURL.AppURL + AppConfigServiceService.settings.Report.WipGraph
  returnData: any;
  randomNum: any
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {
  }

  getReportID(userIndex, branchCode, productCode): Observable<any> {
    console.log('inside service 2')
    return this.http.get<any>(this.BamReport_URL, {
      params: {
        userIndex: userIndex,
        branchCode: branchCode,
        productCode: productCode
      }
    }).pipe();
  }

  getMyPerformance(userIndex, branchName, productName, dateFilter) {
    this.randomNum = this.getRandom()
    return this.http.get<any>(this.MyPerformance_URL, {
      params: {
        userIndex: userIndex,
        branchName: branchName,
        productName: productName,
        dateFilter: dateFilter,
        randomNumber: this.randomNum
      }
    })
  }

  getMyTeamPerformance(branchName, productName, dateFilter) {
    this.randomNum = this.getRandom()
    return this.http.get<any>(this.MyTeamPerformance_URL, {
      params: {
        branchName: branchName,
        productName: productName,
        dateFilter: dateFilter,
        randomNumber: this.randomNum
      }
    })
  }

  getRandom(): number {
    return (Math.random())
  }

  getWIPGraphic(branchName, productName) {
    this.randomNum = this.getRandom()
    return this.http.get<any>(this.WIPGraphic_URL, {
      params: {
        branchCode: branchName,
        productCode: productName,
        randomNumber: this.randomNum
      }
    })
  }
}
