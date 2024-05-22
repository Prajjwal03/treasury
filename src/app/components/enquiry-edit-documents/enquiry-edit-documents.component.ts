import {Component, OnInit, Input, ViewChild, ElementRef, NgZone, ComponentRef, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {NgForm} from '@angular/forms';
import {TestComponentComponent} from 'src/app/components/test-component/test-component.component';
import {AppComponent} from 'src/app/app.component';

declare var opall: any;
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {UploadFileService} from 'src/app/services/upload-file.service';
import {FileUploader} from 'ng2-file-upload';
import {NotificationsService} from 'angular2-notifications';
import {AppConfigServiceService} from '../../services/app-config-service.service'
import * as fileSaver from 'file-saver';

const URL = '';

@Component({
  selector: 'app-enquiry-edit-documents',
  templateUrl: './enquiry-edit-documents.component.html',
  styleUrls: ['./enquiry-edit-documents.component.scss']
})

export class EnquiryEditDocumentsComponent implements OnInit {

  GetDoc = AppConfigServiceService.settings.Document.GetDocument


  Download = AppConfigServiceService.settings.Document.Download
  Opall = AppConfigServiceService.settings.Document.Opall
  ViewAnnotation = AppConfigServiceService.settings.Document.ViewAnnotation
  WriteAnnotation = AppConfigServiceService.settings.Document.WriteAnnotation
  OpAllJSP = AppConfigServiceService.settings.Document.OpAllJSP;
  limit = AppConfigServiceService.settings.Document.UploadLimit
  SupportedFormats = AppConfigServiceService.settings.Document.SupportedFormats;
  @Input() modalID

  VersionComments: string;
  modelID: string
  modelIdDoclist: string;
  modelIDCheckOUT: any;
  modelIDCheckIN: any;
  modelIDVersion: any;
  chumma: any;
  test: any;
  downloadFlag: boolean = false;
  @ViewChild(AppComponent, {static: false}) public opall: AppComponent;
  @ViewChild('frame2', {static: false}) frame2: ElementRef;
  @ViewChild('form', {static: false}) postForm: NgForm;
  uploadLimit: number = 10;
  Limit: number = 10;

  userName = JSON.parse(sessionStorage.getItem("currentUser")).userName;
  userDBId = JSON.parse(sessionStorage.getItem("currentUser")).sessionID;
  documentList: any = []
  dropdownlist: any = []
  tempDocumentList: any = []
  CheckInfile: File;
  CheckInfileName: any;
  window_url: any;
  invaliddocflag: boolean = false;
  opallview: string;
  nofpages: any;
  annotationurl: any;
  writeannotationurl: any;
  selectedDocIndex: any = null;
  CheckOutFlag: any;
  CheckOutFlag1: any;
  url1: any
  allChecked = false;
  checkbox1 = [];
  filesize = [];
  filesizeunit = [];
  CheckINOUTFlag: string = "0";
  url11: SafeResourceUrl;
  url_ImageFileName: any;
  selectedFiles: FileList;
  selectedFilesBrowse: FileList;
  currentFileUpload: File;
  type = [];
  ind = 0;
  optionIsNull = true;
  progress: { percentage: number } = {percentage: 0};
  submitted = false;
  VersionType: any = 'Major';
  uploadTypes = [];
  selectedDoc: any = "Select";
  opallframeflag: boolean = false;
  documents: any = []
  files = [];
  docutype = [];
  temfiles = [];
  temfiles1 = [];
  temdocutype = [];
  src: any;
  private reqBody: any;
  DisabledButtonForm2: boolean;
  pdf_src: SafeResourceUrl;
  showPortal = false;
  req: JSON
  jspPage: any
  docExists: boolean = false;
  ToShow: any = 0;
  TransactionType: any = '';
  TransactionTypeSubType: any = '';
  Branch: any = '';
  Product: any = '';
  displayFlag: boolean = false;
  ErrorMsg: boolean = true;
  msg = '';
  public windowReference: any;


  ngAfterViewInit() {

  }

  constructor(private zone: NgZone, private notif: NotificationsService, private sanitizer: DomSanitizer, private http: HttpClient, private uploadService: UploadFileService, private r: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef/*private data: IFormVisbilityService/*, private myInjector: WindowsInjetor*/) {
    this.url11 = sanitizer.bypassSecurityTrustResourceUrl(this.Opall);

    window['subscribeToAlert1'] = (TransactionType, TransactionTypeSubType, Branch, Product) => {
      zone.run(() => {
        this.loadAlert(TransactionType, TransactionTypeSubType, Branch, Product);
      });
    };
  }

  loadAlert(TransactionType, TransactionTypeSubType, Branch, Product) {
    this.TransactionType = TransactionType;
    this.TransactionTypeSubType = TransactionTypeSubType;
    this.Branch = Branch;
    this.Product = Product;

    this.checkTransType();
  }

  precheck: boolean = false;

  preCheck() {

    this.precheck = true;
    this.checkTransType();
  }

  checkTransType() {
    this.Branch = window.top.frames[0].document.getElementById('BranchCode')['value']
    this.Product = window.top.frames[0].document.getElementById('BusinessCategoryCode')['value']
    this.TransactionType = window.top.frames[0].document.getElementById('TransactionTypeCode')['value']
    this.TransactionTypeSubType = window.top.frames[0].document.getElementById('TransactionSubTypeCode')['value']

    if (this.TransactionType == '' || this.TransactionType == undefined || this.TransactionType == null || this.TransactionType == 'Select') {
      this.displayFlag = false;
      if (this.precheck) {
        this.notif.warn(
          '',
          'Please Select Transaction Type', {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          }
        )
      }
    } else {
      this.displayFlag = true;
    }

    this.getWorkitemData();
  }

  showWindow() {
    setTimeout(() => {
      const factory = this.r.resolveComponentFactory(TestComponentComponent);
      const comp: ComponentRef<TestComponentComponent> = this.viewContainerRef.createComponent(factory);
      comp.instance.someInputField = this.windowReference.document.body;
      this.windowReference.document.body.appendChild(comp.location.nativeElement);
    });

    var mapForm = document.createElement("form");
    mapForm.target = "Map";
    mapForm.method = "POST";
    mapForm.action = this.OpAllJSP + "?opallflag=" + this.opallview;

    var mapInput = document.createElement("input");
    mapInput.type = "hidden";
    mapInput.name = "url_ImageFileName";
    mapInput.value = this.window_url;

    var mapInput1 = document.createElement("input");
    mapInput1.type = "hidden";
    mapInput1.name = "noOfPages";
    mapInput1.value = this.nofpages;

    var mapInput2 = document.createElement("input");
    mapInput2.type = "hidden";
    mapInput2.name = "URL_Annotation";
    mapInput2.value = this.annotationurl;

    var mapInput3 = document.createElement("input");
    mapInput3.type = "hidden";
    mapInput3.name = "url_WriteAnnotation";
    mapInput3.value = this.writeannotationurl;

    var mapInput4 = document.createElement("input");
    mapInput4.type = "hidden";
    mapInput4.name = "CheckINOUTFlag";
    mapInput4.value = this.CheckINOUTFlag;

    mapForm.appendChild(mapInput);
    mapForm.appendChild(mapInput1);
    mapForm.appendChild(mapInput2);
    mapForm.appendChild(mapInput3);
    mapForm.appendChild(mapInput4);

    document.body.appendChild(mapForm);

    this.windowReference = window.open("", "Map", "status=0,title=0,height=600,width=800,scrollbars=1");

    if (this.windowReference) {
      mapForm.submit();
    } else {
      alert('You must allow popups for this map to work.');
    }


  }


  finurl: any;

  ngOnInit() {
    this.modelID = this.modalID['pid']
    this.modelID = this.modelID.toLowerCase()
    this.modelIdDoclist = this.modelID + 'edit';
    this.modelIDCheckOUT = this.modelID + 'checkout';
    this.modelIDCheckIN = this.modelID + 'checkin';
    this.modelIDVersion = this.modelID + 'version';
    this.finurl = this.Opall + '?url_ImageFileName=';
    this.src = this.Opall;
    this.url11 = this.Opall;
    this.checkbox1[0] = true;
    this.Branch = window.top.frames[0].document.getElementById('BranchCode')['value']
    this.Product = window.top.frames[0].document.getElementById('BusinessCategoryCode')['value']
    this.TransactionType = window.top.frames[0].document.getElementById('TransactionTypeCode')['value']
    this.TransactionTypeSubType = window.top.frames[0].document.getElementById('TransactionSubTypeCode')['value']
    this.getWorkitemData();
  }

  downloadDoc() {
    this.uploadService.downloadDoc(this.window_url + "&DownloadFlag=Y").subscribe(data => {
    })
  }

  showDoc(docs) {
    this.checkOutSuccess = false;
    this.checkOutError = false;
    this.UndoSuccess = false;
    this.UndoError = false;
    this.CheckInfile = null;
    this.CheckInfileName = "";

    if (this.documentList[docs].checkOutFlag == 'Y')
      this.CheckOutFlag = true;
    else
      this.CheckOutFlag = false;
    this.selectedDocIndex = docs;

    if (this.documentList[docs].documentType == 'I') {
      this.opallview = "Y"
      opall.PARAM.url_ImageFileName = this.GetDoc + '?ImgIndex=' + this.documentList[docs].imageIndex + '&VolIndex=1&DocExt=' + this.documentList[docs].documentExt + '&PageNo=1&docType=' + this.documentList[docs].documentType + '&DocSize=' + this.documentList[docs].documentSize + '&ArchivalMode=&ArchivalCabinet=&wid=&pid=&taskid=&DMSSessionId=&EngineName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&DocumentName=' + this.documentList[docs].comment;
      this.window_url = this.GetDoc + '?ImgIndex=' + this.documentList[docs].imageIndex + '&VolIndex=1&DocExt=' + this.documentList[docs].documentExt + '&PageNo=1&docType=' + this.documentList[docs].documentType + '&DocSize=' + this.documentList[docs].documentSize + '&ArchivalMode=&ArchivalCabinet=&wid=&pid=&taskid=&DMSSessionId=&EngineName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&DocumentName=' + this.documentList[docs].comment;


      opall.PARAM.NumberOfPages = this.documentList[docs].noOfPages;
      opall.PARAM.ServerSupportMultiPage = true;
      opall.PARAM.num_VisiblePage = 1;
      opall.PARAM.bValidateURLContext = false;
      opall.PARAM.AnnotationDisplay = true;
      opall.PARAM.toolbarVersion = 1;
      opall.PARAM.URL_Annotation = this.ViewAnnotation + '?DocId=' + this.documentList[docs].documentIndex + '&Version=' + this.documentList[docs].documentVersionNo + '&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&PageNo=1&isadmin=true&loginuser=' + JSON.parse(sessionStorage.getItem("currentUser")).userName;
      opall.PARAM.url_WriteAnnotation = this.WriteAnnotation + '/DocId=' + this.documentList[docs].documentIndex + '&Option=SaveAnnot&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&J2EE=1&StampDocImagePath=/stamps/AllImages/temp/&StampIniPath=/stamps/conf/&StampImagePath=/stamps/AllImages/&Encoding=UTF-8&stampNewIni=stamp.ini&PageNo=1';
      if (this.documentList[docs].checkOutFlag == "Y" || !this.documentList[docs].ModifyAccess) {
        opall.PARAM.AnnotationOption = 1;
      } else {
        opall.PARAM.AnnotationOption = 0;
      }

      this.annotationurl = opall.PARAM.URL_Annotation;
      this.writeannotationurl = opall.PARAM.url_WriteAnnotation;
      this.nofpages = this.documentList[docs].noOfPages;
      this.CheckINOUTFlag = opall.PARAM.AnnotationOption;
      opall.showViewer(document.getElementById('DocFrame'), this.Opall, '', '');
      this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.Opall);
    } else {
      this.window_url = this.GetDoc + '?ImgIndex=' + this.documentList[docs].imageIndex + '&VolIndex=1&DocExt=' + this.documentList[docs].documentExt + '&PageNo=1&docType=' + this.documentList[docs].documentType + '&DocSize=' + this.documentList[docs].documentSize + '&ArchivalMode=&ArchivalCabinet=&wid=&pid=&taskid=&DMSSessionId=&EngineName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&DocumentName=' + this.documentList[docs].comment;
      this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
      this.opallview = "N";
    }
    this.downloadURL = this.window_url + "&DownloadFlag=Y";
  }

  onSubmit() {
    event.preventDefault();
    this.reqBody = new FormData();
    const headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');
    const responseType: any = "text";
    const options = {
      headers: headers,
      reportProgress: true,
      responseType: responseType,
    };

    const req = new HttpRequest('POST', this.url1, {
      url_ImageFileName: "",
    }, options);
    this.http.request(req).subscribe(
      data => {
        if (data['body']) {
          this.jspPage = data['body'];
          let content = data['body'];
          let doc = this.frame2.nativeElement.contentDocument || this.frame2.nativeElement.contentWindow;
          doc.open();
          doc.write(content);
          doc.close();
        }
      }, (err) => {
        console.log('err', err)
      });
  }

  toggleControl() {
    this.showPortal = !this.showPortal;
  }

  res: any;
  checkOutSuccess: boolean = false;
  checkOutError: boolean = false;
  UndoSuccess: boolean = false;
  UndoError: boolean = false;

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    fileSaver.saveAs(blob, filename);
  }

  downloadURL: any;
  versionList: any = [];

  Versions() {
    this.uploadService.getVersions(this.documentList[this.selectedDocIndex].documentIndex, "0", "10").subscribe(
      data => {
        this.versionList = data[0]['result']['versionlist'];
      });
  }


  selectFile(event) {
    this.selectedFiles = event;

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.temfiles1.push(this.selectedFiles[i]);
      this.temfiles.push(this.selectedFiles[i]);
      this.type[this.temfiles1.length - 1] = this.uploadTypes[0];
      var splitted = this.selectedFiles[i].name.split('.');

      this.docext.push(splitted[1]);
      var size = this.selectedFiles[i].size;
      if (size < 1000) {
        this.filesize.push(size);
        this.filesizeunit.push("B");
      } else if (size < 1000 * 1000) {
        this.filesize.push(size / 1000);
        this.filesizeunit.push("KB");
      } else if (size < 1000 * 1000 * 1000) {
        this.filesize.push(size / 1000 / 1000);
        this.filesizeunit.push("MB");
      } else {
        this.filesize.push(size / 1000 / 1000 / 1000);
        this.filesizeunit.push("GB");
      }
    }
  }

  docext = [];

  selectFileBrowse(event) {
    this.selectedFilesBrowse = event.target.files;
    this.temfiles1.push(this.selectedFilesBrowse[0]);
    this.temfiles.push(this.selectedFilesBrowse[0]);

    if (this.selectedFilesBrowse[0].name != '') {
      var splitted = this.selectedFilesBrowse[0].name.split('.');
      this.docext.push(splitted[splitted.length - 1]);
      this.type[this.temfiles1.length - 1] = this.uploadTypes[0];

      var size = this.selectedFilesBrowse[0].size;
      if (size < 1000) {
        this.filesize.push(size);
        this.filesizeunit.push("B");
      } else if (size < 1000 * 1000) {
        this.filesize.push(size / 1000);
        this.filesizeunit.push("KB");
      } else if (size < 1000 * 1000 * 1000) {
        this.filesize.push(size / 1000 / 1000);
        this.filesizeunit.push("MB");
      } else {
        this.filesize.push(size / 1000 / 1000 / 1000);
        this.filesizeunit.push("GB");
      }
    }
  }

  selectFileCheckIn(event) {
    this.msg = '';
    this.ErrorMsg = true;
    var SupportFlag: boolean = false;
    this.selectedFiles = event.target.files;
    var CurrentDocFormat = this.selectedFiles[0].name.split('.');
    var SupFormat = this.SupportedFormats.split(',');
    this.CheckInfile = this.selectedFiles[0];
    this.CheckInfileName = this.CheckInfile.name;

    for (let i = 0; i < SupFormat.length; i++) {
      if (SupFormat[i] == CurrentDocFormat[CurrentDocFormat.length - 1]) {
        SupportFlag = true;
        break;
      }
    }

    if (this.selectedFiles[0].size / 1024 <= this.limit * 1024 && SupportFlag) {
      this.ErrorMsg = false;
    } else {
      if (!SupportFlag) {
        this.ErrorMsg = true;
        this.msg = '*Unsupported File Format';
      } else if (this.selectedFiles[0].size == 0) {
        this.ErrorMsg = true;
        this.msg = '* Cannot Find File Size';
      } else {
        this.ErrorMsg = true;
        this.msg = '*File Size Exceeds' + this.limit + ' MB';
      }
    }
  }

  selectFileBrowseCheckIn(event) {
    this.selectedFilesBrowse = event.target.files;
    this.CheckInfile = this.selectedFilesBrowse[0];
    this.CheckInfileName = this.CheckInfile.name;
  }

  addToTable(filetoadd: File, filetype: string) {
  }

  remove(event) {
    this.temfiles.splice(event, 1)
    this.temfiles1.splice(event, 1)
    this.docext.splice(event, 1)
    this.type.splice(event, 1)
    this.filesize.splice(event, 1)
    this.filesizeunit.splice(event, 1)
  }


  removefromtemparray(filetoremove: File, typetoremove: string) {
    const index: number = this.temfiles.indexOf(filetoremove);
    if (index !== -1) {
      this.temfiles.splice(index, 1);
      this.docext.splice(index, 1)
      this.filesize.splice(index, 1)
      this.filesizeunit.splice(index, 1)
    }
  }

  flag: boolean = true;
  modelshowflag: boolean = true;
  total: any;

  async upload(modelflag) {
    this.progress.percentage = 0;
    for (let k = 0; k < this.temfiles1.length; k++) {
      var SupportFlag: boolean = false;
      this.uploadLimit = 10 * 1024;
      var CurrentDocFormat = this.temfiles1[k].name.split('.');
      var SupFormat = this.SupportedFormats.split(',');

      for (let i = 0; i < SupFormat.length; i++) {
        if (SupFormat[i] == CurrentDocFormat[CurrentDocFormat.length - 1]) {
          SupportFlag = true;
          break;
        }
      }

      if (this.temfiles1[k].size / 1024 <= this.limit * 1024 && SupportFlag && this.temfiles1[k].size != 0) {
        await this.fileUpload(k);
        this.total = k;
      } else {
        if (!SupportFlag) {
          this.notif.error(
            'error',
            this.temfiles1[k].name + AppConfigServiceService.settings.ErrorMessages.UnSupportedFileType, {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            }
          )
          this.removefromtemparray(this.temfiles1[k], this.type[k]);
          this.total = k;
        } else if (this.temfiles1[k].size == 0) {
          this.notif.error(
            'error',
            this.temfiles1[k].name + 'this.temfiles1[k].name  : Cannot Find File size', {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            }
          );
          this.removefromtemparray(this.temfiles1[k], this.type[k]);
          this.total = k;
        } else {
          this.notif.error(
            'error',
            this.temfiles1[k].name + AppConfigServiceService.settings.ErrorMessages.FileSizeExceed, {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            }
          )
          this.removefromtemparray(this.temfiles1[k], this.type[k]);
          this.total = k;
        }
      }
    }


    this.optionIsNull = true;
    this.temfiles1 = [];
    this.type = [];
    this.getWorkitemData();
    this.showDoc(this.documentList.length - 1);

    if (this.total + 1 == this.temfiles1.length) {
      if (modelflag) {
        this.modelshowflag = true;
      } else {
        this.modelshowflag = false;
      }
    }
    this.modelshowflag = true;
    this.getWorkitemData();
  }

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;

  }

  async fileUpload(j: any) {
    this.currentFileUpload = this.temfiles1[j];
    await this.uploadService.pushFileToStorage(this.currentFileUpload, this.type[j], this.modelID).toPromise().then(data => {
      this.res = data;
      this.files.push(this.currentFileUpload);
      this.docutype.push(this.type[j]);
      this.removefromtemparray(this.currentFileUpload, this.type[j]);

      if (this.res['status'] == 200) {
        this.notif.success(
          'Success',
          this.currentFileUpload.name + ' Upload Successfully', {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          }
        )
      }
    }, (error) => {
    });
  }


  getWorkitemData() {
    this.uploadService.getWorkitemData(this.userDBId, this.modalID['pid'], this.userName, this.Branch, this.Product, this.TransactionType, this.TransactionTypeSubType, null).subscribe(
      data => {
        this.documentList = data[0]['result']['doucmentList']
        this.uploadTypes = data[0]['result']['uploadTypes'];

        if (this.documentList.length > 0) {
          this.opallframeflag = true;
          this.showDoc(this.ToShow);
        } else {
          this.opallframeflag = false;
        }
      }
    )
  }

  setdropdownlist() {
    for (let i = 0; i < this.dropdownlist.length; i++) {
      if (this.dropdownlist[i].viewAccess)
        this.documentList = this.dropdownlist[i];
    }
  }

  reset1(abc: any) {
    this.ToShow = abc;
    this.showDoc(this.ToShow);
    this.selectedDocIndex = abc;
    for (let i in this.documentList) {
      if (abc != i) {
        this.checkbox1[i] = false;
      }
    }
  }


  showDocVersion(docs) {
    if (this.versionList[docs].documentType == 'I') {
      this.opallview = "Y"
      this.window_url = this.GetDoc + '?ImgIndex=' + this.versionList[docs].imageIndex + '&VolIndex=1&DocExt=' + this.versionList[docs].documentExt + '&PageNo=1&docType=' + this.versionList[docs].documentType + '&DocSize=' + this.versionList[docs].documentSize + '&ArchivalMode=&ArchivalCabinet=&wid=&pid=&taskid=&DMSSessionId=&EngineName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&DocumentName=' + this.versionList[docs].comment;
      this.nofpages = this.versionList[docs].noOfPages;
      this.annotationurl = this.ViewAnnotation + '?DocId=' + this.versionList[docs].documentIndex + '&Version=' + this.versionList[docs].documentVersionNo + '&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&PageNo=1&isadmin=true&loginuser=' + JSON.parse(sessionStorage.getItem("currentUser")).userName;
      this.writeannotationurl = this.WriteAnnotation + '/DocId=' + this.versionList[docs].documentIndex + '&Option=SaveAnnot&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&J2EE=1&StampDocImagePath=/stamps/AllImages/temp/&StampIniPath=/stamps/conf/&StampImagePath=/stamps/AllImages/&Encoding=UTF-8&stampNewIni=stamp.ini&PageNo=1';

      if (this.documentList[docs].checkOutFlag == "Y" || !this.documentList[docs].ModifyAccess) {
        this.CheckINOUTFlag = "1";
      } else {
        this.CheckINOUTFlag = "0";
      }
    } else {
      this.window_url = this.GetDoc + '?ImgIndex=' + this.versionList[docs].imageIndex + '&VolIndex=1&DocExt=' + this.versionList[docs].documentExt + '&PageNo=1&docType=' + this.versionList[docs].documentType + '&DocSize=' + this.versionList[docs].documentSize + '&ArchivalMode=&ArchivalCabinet=&wid=&pid=&taskid=DMSSessionId=&EngineName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName;
      this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
      this.opallview = "N";
    }
    this.showWindow();
  }
}
