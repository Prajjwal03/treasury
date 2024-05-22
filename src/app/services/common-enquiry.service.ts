import {Injectable} from '@angular/core';
import {AppConfigServiceService} from './app-config-service.service';
import {HttpClient} from '@angular/common/http';
import {toArray} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CommonEnquiryService {
  restAPI_URL = AppConfigServiceService.settings.ServerURL.AppURL
  userBranch_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.UserBranch
  userProduct_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.UserProduct
  enquiryDetails_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.GetEnquiryDetails
  userName_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.UserName
  application_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.ApplicationValues
  DropDown_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.DropDown
  dropDownTransactionType = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.DropDownTransactionType
  caseStatus_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.CaseStatus
  constructor(private http: HttpClient) {
  }

  getBranch(userIndex) {
    // todo use /models/BranchInfo
    return this.http.get<any>(this.userBranch_URL, {
      params: {
        userIndex: userIndex
      }
    })
  }

  getApplications() {
    return this.http.get<any>(this.application_URL)
  }

  getUserName(userIndex) {
    return this.http.get<any>(this.userName_URL, {
      params: {
        userIndex: userIndex
      }
    })
  }

  getProduct(userIndex, branchName) {
    return this.http.get<any>(this.userProduct_URL, {
      params: {
        userIndex: userIndex,
        branchName: branchName
      }
    })
  }

  getDropDownData(name) {
    return this.http.get<any>(this.DropDown_URL, {
      params: {
        type: name
      }
    })
  }

  getEnquiryDetails(field) {
    console.log('sdsss')
    return this.http.post<any>(this.enquiryDetails_URL, {field}).pipe(toArray<Object>());
  }
  getDropDownDataTransactionType(userIndex, branchCode, productCode) {
    return this.http.get<any>(this.dropDownTransactionType, {
      params: {
        userIndex: userIndex,
        branchCode: branchCode,
        productCode: productCode
      }
    })
  }
  getDropDownCaseStatus(branchCode, productCode) {
    return this.http.get<any>(this.caseStatus_URL, {
      params: {
        branchCode: branchCode,
        productCode: productCode
      }
    })
  }
}
