import {Injectable} from '@angular/core';
import {AppConfigServiceService} from './app-config-service.service';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {toArray, retry, catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {AuthenticationService} from './authentication.service';
import {PopUPService} from './pop-up.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  static createFlag: boolean;
  static noOfTabs: any = -1;
  static navigaton: any = 'dashboard';
  private session_url: string = AppConfigServiceService.settings.Login.UserSession;
  restAPI_URL = AppConfigServiceService.settings.ServerURL.AppURL
  EPIXTreasuryWebURL = AppConfigServiceService.settings.ServerURL.EPIXTreasuryWebURL;
  craeteAuth_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.CreatedAuth;
  toDoField_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.ToDOFields;
  teamToDo_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.TeamToDoData;
  dropDownData_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.DropDownData;
  temp_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.TempToDo;
  addToWatchList_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.AddToWatchList;
  unWatchList_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.UnWatchList;
  getMyWatchList_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.GetWatchList;
  todoTableField_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.TODOTableFields
  enquiryField_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.EnquiryFields
  enquiryTableField_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.EnquiryTableFields
  session_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.SessionStatus
  commentHistory_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.GetCommentHistory
  versionHistory_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.GetVersionHistory
  swapLink_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.GetSwapLink
  utilizationReversalHistory_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.GetUtilizationReversalHistory
  callbackAmendmentHistory_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.GetcallbackAmendmentHistory
  userRoleDetails_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.userRoleDetails
  relatedT24_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.RealtedT24
  IformData_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.IformData_URL
  CustomDashboardSubProduct_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.CustomDashboardSubProductData
  CustomDashboardCurrency_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.CustomDashboardCurrencyData
  RoleName_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.RoleName
  CallbackAmendment_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.CallbackAmendment
  UtilizationReversal_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.UtilizationReversal
  randomNum: any

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService,
              private popUPService: PopUPService,
              private router: Router) {
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }

    return throwError('Something bad happened; please try again later.');
  };

  getdashboardTableFields(branchCode, productCode, userIndex) {
    console.log('getdashboardTableFields: My Todo URL', this.toDoField_URL)
    return this.http.get<any>(this.toDoField_URL, {
      params: {
        branchCode: branchCode,
        productCode: productCode,
        userIndex: userIndex
      }
    }).pipe(toArray<Object>())
  }

  getdashboardColumnTableFields(branchCode, productCode, userIndex) {
    console.log('etdashboardColumnTableFields: My Todo URL', this.todoTableField_URL)
    return this.http.get<any>(this.todoTableField_URL, {
      params: {
        branchCode: branchCode,
        productCode: productCode,
        userIndex: userIndex
      }
    }).pipe(toArray<Object>())
  }

  getEnquiryTableFields(branchCode, productCode, userIndex) {
    console.log('getEnquiryTableFields: My Todo URL', this.enquiryField_URL)
    return this.http.get<any>(this.enquiryField_URL, {
      params: {
        branchCode: branchCode,
        productCode: productCode,
        userIndex: userIndex
      }
    }).pipe(toArray<Object>())
  }

  getRoleName(userIndex) {
    console.log('Role Name', this.RoleName_URL)
    return this.http.get<any>(this.RoleName_URL, {
      params: {
        userIndex: userIndex
      }
    }).pipe(toArray<Object>())
  }

  callbackAmendment(processID, userName) {
    console.log('callbackAmendment', this.CallbackAmendment_URL)
    return this.http.get<any>(this.CallbackAmendment_URL, {
      params: {
        pid: processID,
        username: userName
      }
    }).pipe(toArray<Object>())
  }

  utilizationReversal(processID, userName) {
    console.log('utilizationReversal', this.UtilizationReversal_URL)
    return this.http.get<any>(this.UtilizationReversal_URL, {
      params: {
        pid: processID,
        username: userName
      }
    }).pipe(toArray<Object>())
  }

  getEnquiryColumnTableFields(branchCode, productCode, userIndex) {
    console.log('getEnquiryColumnTableFields: My Todo URL', this.enquiryTableField_URL)
    return this.http.get<any>(this.enquiryTableField_URL, {
      params: {
        branchCode: branchCode,
        productCode: productCode,
        userIndex: userIndex
      }
    }).pipe(toArray<Object>())
  }

  getDropDownData(tabName: any, colName: any) {
    return this.http.get<any>(this.dropDownData_URL, {
      params: {
        tableName: tabName,
        columnName: colName
      }
    })
  }

  getMyToDoList(field: any): Observable<any> {
    console.log("getMyToDoList: inside getWorkItemData service", field);
    console.log(JSON.stringify(field));
    return this.http.post<any>(this.temp_URL, {field}).pipe(toArray<Object>());
  }

  getMyWatchList(field: any): Observable<any> {
    console.log("getMyWatchList: inside getWorkItemData service", field);
    console.log(JSON.stringify(field));
    return this.http.post<any>(this.getMyWatchList_URL, {field}).pipe(toArray<Object>());
  }

  addToWatchList(transactionNo, userIndex) {
    return this.http.post(this.addToWatchList_URL, {
      transactionRefNo: transactionNo,
      createdBy: userIndex
    }).pipe(toArray<Object>())
  }

  getSessionStatus() {
    return this.http.post(this.session_URL, {
      randomNumber: JSON.parse(sessionStorage.getItem("currentUser")).sessionID,
      userIndex: JSON.parse(sessionStorage.getItem("currentUser")).userIndex
    })
  }

  unWatchList(transactionNo, userIndex) {
    return this.http.post(this.unWatchList_URL, {
      transactionRefNo: transactionNo,
      createdBy: userIndex
    }).pipe(toArray<Object>())
  }

  getCreateFlag(userIndex) {
    return this.http.get<any>(this.craeteAuth_URL, {
      params: {
        userIndex: userIndex
      }
    })
  }

  getCommentHistory(transactionID) {
    this.randomNum = this.getRandom()
    return this.http.get<any>(this.commentHistory_URL, {
      params: {
        transactionID: transactionID,
        randomId: this.randomNum
      }
    })
  }

  getVersionHistory(transactionID, contractNo) {
    return this.http.get<any>(this.versionHistory_URL, {
      params: {
        transactionID: transactionID,
        contractNo: contractNo
      }
    })
  }

  getSwapLink(transactionID, contractNo) {
    return this.http.get<any>(this.swapLink_URL, {
      params: {
        transactionID: transactionID,
        contractNo: contractNo
      }
    })
  }
  getUtilizationReversalHistoryLink(pid) {
    return this.http.get<any>(this.utilizationReversalHistory_URL, {
      params: {
        pid: pid,
      }
    })
  }

  getCallbackAmendmentHistoryLink(pid) {
    return this.http.get<any>(this.callbackAmendmentHistory_URL, {
      params: {
        pid: pid,
      }
    })
  }

  getTransactionId(relT24Id, branchCode, productCode) {
    return this.http.get<any>(this.relatedT24_URL, {
      params: {
        relT24ID: relT24Id,
        branchName: branchCode,
        productName: productCode
      }
    })
  }

  getRandom(): number {
    return (Math.random())
  }

  setNoOFTabs(tabs) {
    TableService.noOfTabs = tabs
  }

  setNavigation(name) {
    TableService.navigaton = name
  }

  getUserRoleDetails(userIndex) {
    return this.http.get<any>(this.userRoleDetails_URL, {
      params: {
        userIndex: userIndex
      }
    }).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  sessionValidation() {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {

      this.http.post<any>(this.session_url, JSON.stringify(currentUser), this.httpOptions).subscribe(data => {
        console.log(data);
        if (data) {
          if (data.result !== '0') {
            this.popUPService.confirm("Your Session Expired");
            this.setNoOFTabs(-1)
            sessionStorage.removeItem('currentUser');
            sessionStorage.clear()

            this.router.navigate(['/login']);
          }
        }
      })
    }
  }

  sessionValidationCallback(): Promise<boolean> {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      return this.http.post<any>(this.session_url, JSON.stringify(currentUser), this.httpOptions)
        .toPromise()
        .then((data) => {
          console.log(data);
          if (data && data.result == '0') {
            return true;
          }
        })
    }
    this.popUPService.confirm("Your Session Expired");
    this.setNoOFTabs(-1);
    sessionStorage.removeItem('currentUser');
    sessionStorage.clear();
    this.router.navigate(['/login']);
    return Promise.resolve(false);
  }

  getIformDetails(productCode) {
    console.log('getIformDetails', this.IformData_URL)
    return this.http.get<any>(this.IformData_URL, {
      params: {
        productCode: productCode
      }
    })
  }

  getCustomDashboardSubProductData() {
    console.log('getCustomDashboardSubProductData', this.CustomDashboardSubProduct_URL)
    return this.http.get<any>(this.CustomDashboardSubProduct_URL);
  }

  getCustomDashboardCurrencyData() {
    console.log('getCustomDashboardCurrencyData', this.CustomDashboardCurrency_URL)
    return this.http.get<any>(this.CustomDashboardCurrency_URL);
  }

  getCleanSession(url) {
    url = this.EPIXTreasuryWebURL + url;
    console.log("url for clean", url);
    this.http.get(url, {responseType: 'text'}).subscribe();
  }
}
