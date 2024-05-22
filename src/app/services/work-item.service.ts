import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {toArray, map} from 'rxjs/operators';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {AppConfigServiceService} from './app-config-service.service';
import {InputService} from './input.service';

@Injectable({
  providedIn: 'root'
})
export class WorkItemService {

  workItemDetailsJSON: any;
  temp: any
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  // todo get url from backend?
  customerName_url = "http://192.168.13.156:8080/EPIXCOB-0.1.0/cob/Customer-Name";
  customerId_url = "http://192.168.13.156:8080/EPIXCOB-0.1.0/cob/Customer-Id";
  createWorkItem_url = AppConfigServiceService.settings.Document.CreateWorkItem
  unlockWorkItem_url = AppConfigServiceService.settings.Document.UnlockWorkItem
  deleteWorkItem_url = "http://192.168.13.120:8080/EPIXTransactionServicesWeb1/iforms/deleteData/";
  productCode: string = '';
  branchCode: string = '';

  constructor(private http: HttpClient) {
  }

  public getNewPid(sessionIDInput, roleId, intiatedByCategory) {
    console.log("inside service:");
    this.productCode = InputService.input.productCode;
    this.branchCode = InputService.input.branchCode;
    console.log("getNewPid input:" + sessionIDInput);
    return this.http.post<any>(this.createWorkItem_url, {
      sessionID: sessionIDInput, Role: roleId,
      InitiatedByCategory: intiatedByCategory, ProductCode: this.productCode,
      BranchCode: this.branchCode
    }).pipe(toArray<Object>());
  }

  searchCustomerNameID(term, url) {
    var listOfName = this.http.get(url, {params: {searchString: term}})
      .pipe(
        debounceTime(500),
        map(
          (data: any) => {
            return (
              data.length != 0 ? data as any[] : [{"CustomerName": "No Record Found"} as any]
            );
          }
        ));
    return listOfName;
  }

  searchCustomerName(term) {
    this.searchCustomerNameID(term, this.customerName_url)
  }

  searchCustomerId(term) {
    this.searchCustomerNameID(term, this.customerId_url)
  }

  createWorkItem(instructionId, roleId, intiatedByCategory) {
    return this.http.post<any>(this.createWorkItem_url, {
      sessionID: JSON.parse(sessionStorage.getItem("currentUser")).sessionID,
      processInstanceId: instructionId,
      Role: roleId,
      InitiatedByCategory: intiatedByCategory
    }, this.httpOptions).pipe(toArray<Object>());
  }

  unlockWorkItem(pID, WorkItemId) {
    return this.http.post<any>(this.unlockWorkItem_url, {
      sessionID: JSON.parse(sessionStorage.getItem("currentUser")).sessionID,
      processInstanceId: pID,
      WorkItemId: WorkItemId
    }).pipe(toArray<Object>());
  }

  deleteWorkItem(pid: string) {
    const workItemDetails = {
      processInstanceID: pid,
      cabinetName: JSON.parse(sessionStorage.getItem("currentUser")).cabinetName,
      sessionID: JSON.parse(sessionStorage.getItem("currentUser")).sessionID,
      serverIP: JSON.parse(sessionStorage.getItem("currentUser")).serverIP,
      port: JSON.parse(sessionStorage.getItem("currentUser")).port
    };

    this.workItemDetailsJSON = JSON.stringify(workItemDetails);
    return this.http.post<any>(this.deleteWorkItem_url, this.workItemDetailsJSON,
      this.httpOptions)
      .subscribe(statuss => {
        if (statuss) {
          console.log(statuss);
        }
      });
  }
}
