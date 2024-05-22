import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {AppConfigServiceService} from './app-config-service.service'
import {InputService} from './input.service';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  CheckOut = AppConfigServiceService.settings.Document.CheckOut
  DeleteURL = AppConfigServiceService.settings.Document.Delete
  Upload = AppConfigServiceService.settings.Document.Upload
  VersionsURL = AppConfigServiceService.settings.Document.Versions
  GetWorkitemData = AppConfigServiceService.settings.Document.GetWorkitemData
  CheckIn = AppConfigServiceService.settings.Document.CheckIn
  GetUploadTypes = AppConfigServiceService.settings.Document.GetUploadTypes
  GetWIHistory = AppConfigServiceService.settings.Document.GetWIHistory
  FileDownload = AppConfigServiceService.settings.Document.FileDownload

  ProductCode: string = '';

  constructor(private http: HttpClient) {
  }

  pushFileToStorage(file: File, docutype: string, pid: string): Observable<HttpEvent<{}>> {
    const formdata: FormData = new FormData();
    formdata.append('userId', JSON.parse(sessionStorage.getItem("currentUser")).userIndex);
    formdata.append('DocumentName', docutype);
    formdata.append('cabinetName', JSON.parse(sessionStorage.getItem("currentUser")).cabinetName);
    formdata.append('userDBId', JSON.parse(sessionStorage.getItem("currentUser")).sessionID);
    formdata.append('pId', pid);
    formdata.append('file', file);

    console.log('Files to be pushed', file);
    console.log("formdata", formdata);

    const req = new HttpRequest('POST', this.Upload, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getWorkitemData(sessionID: string, processInstanceId: string, UserName: string, Branch: any, Product: any, TransactionType: any, TransactionSubType: any, SourceFlag: any, WorkItemId?: any): Observable<Object> {
    this.ProductCode = InputService.input.productCode;
    console.log("Inside getWorkitemData Service");

    return this.http.post(this.GetWorkitemData, {
      sessionID: sessionID,
      processInstanceId: processInstanceId,
      UserName: UserName,
      UserIndex: JSON.parse(sessionStorage.getItem("currentUser")).userIndex,
      Branch: Branch,
      Product: Product,
      TransactionType: TransactionType,
      TransactionSubType: TransactionSubType,
      ProductCode: this.ProductCode,
      WorkItemId: WorkItemId
    }).pipe(toArray<Object>())
  }

  documentDownload(sessionID: string, docs: any): Observable<Object> {
    console.log('inside documentDownload method');
    console.log('sessionID ', sessionID);
    console.log('docs ', docs);
    return this.http.post(this.FileDownload, {
      sessionID: sessionID,
      docs: docs
    }, {responseType: "blob"}).pipe(toArray<Object>())
  }

  getVersions(DocumentIndex: string, StartVersion: string, No: string): Observable<Object> {
    return this.http.post(this.VersionsURL, {
      DocumentIndex: DocumentIndex,
      sessionId: JSON.parse(sessionStorage.getItem("currentUser")).sessionID,
      CabinetName: JSON.parse(sessionStorage.getItem("currentUser")).cabinetName,
      StartVersion: StartVersion,
      No: No,
    }).pipe(toArray<Object>())
  }

  checkOutDocument(docIndex: string, isIndex: string, checkoutFlag: string, pId: string, DocumentName: string): Observable<HttpEvent<{}>> {
    console.log("Inside checkOutDocument Service");
    const formdata: FormData = new FormData();
    formdata.append('DocumentIndex', docIndex);
    formdata.append('IsIndex', isIndex);
    formdata.append('sessionID', JSON.parse(sessionStorage.getItem("currentUser")).sessionID);
    formdata.append('CheckOutFlag', checkoutFlag);
    formdata.append('pId', pId);
    formdata.append('DocumentName', DocumentName);
    formdata.append('CabinetName', JSON.parse(sessionStorage.getItem("currentUser")).cabinetName);

    const req = new HttpRequest('POST', this.CheckOut, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  deleteDocument(docIndex: string, parentFolderIndex: string, pId: string, DocumentName: string): Observable<HttpEvent<{}>> {
    console.log("Inside checkOutDocument Service");
    const formdata: FormData = new FormData();
    formdata.append('DocumentIndex', docIndex);
    formdata.append('ParentFolderIndex', parentFolderIndex);
    formdata.append('pId', pId);
    formdata.append('DocumentName', DocumentName);
    formdata.append('sessionId', JSON.parse(sessionStorage.getItem("currentUser")).sessionID);
    formdata.append('CabinetName', JSON.parse(sessionStorage.getItem("currentUser")).cabinetName);

    const req = new HttpRequest('POST', this.DeleteURL, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  downloadDoc(DocUrl: any): Observable<any> {
    console.log("Inside Download Doc");
    console.log('DocUrl', DocUrl);
    return this.http.get(DocUrl);
  }

  getFiles(): Observable<any> {
    return this.http.get('/getallfiles');
  }

  checkInDocument(Docindex: any, versionComments: any, DocExtension: any, CheckInFile: any, Version: any, pId: any, DocumentName: any): Observable<HttpEvent<{}>> {
    var val;
    console.log("Inside CheckIn Document");
    console.log("version", Version);
    if (Version == 'Major') {
      val = 'Y'
    } else {
      val = 'N'
    }
    console.log("versionComments", versionComments);
    const formdata: FormData = new FormData();
    formdata.append('Docindex', Docindex);
    formdata.append('Extension', DocExtension);
    formdata.append('versionComments', versionComments);
    formdata.append('MajorVersion', val);
    formdata.append('pId', pId);
    formdata.append('DocumentName', DocumentName);
    formdata.append('CabinetName', JSON.parse(sessionStorage.getItem("currentUser")).cabinetName);
    formdata.append('UserDbId', JSON.parse(sessionStorage.getItem("currentUser")).sessionID);
    formdata.append('file', CheckInFile);

    const req = new HttpRequest('POST', this.CheckIn, formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getUploadTypes(sessionID: string, processInstanceId: string, UserName: string, Branch: any, Product: any, TransactionType: any, TransactionSubType: any): Observable<Object> {
    console.log("Inside getWorkitemData Service");
    this.ProductCode = InputService.input.productCode;
    return this.http.post(this.GetUploadTypes, {
      sessionID: sessionID,
      processInstanceId: processInstanceId,
      UserName: UserName,
      UserIndex: JSON.parse(sessionStorage.getItem("currentUser")).userIndex,
      Branch: Branch,
      Product: Product,
      TransactionType: TransactionType,
      TransactionSubType: TransactionSubType,
      ProductCode: this.ProductCode
    }).pipe(toArray<Object>())
  }

  getWIHistory(ProcessInstanceId: string, NoOfRecordsToFetch: string, SessionId: string) {
    console.log("Inside getWIHistory Service");
    return this.http.post(this.GetWIHistory, {
      EngineName: JSON.parse(sessionStorage.getItem("currentUser")).cabinetName,
      SessionId: SessionId,
      ProcessInstanceId: ProcessInstanceId,
      NoOfRecordsToFetch: NoOfRecordsToFetch
    }).pipe(toArray<Object>())
  }
}
