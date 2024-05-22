import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  ElementRef,
  HostListener,
  EventEmitter,
  NgZone,
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef
} from '@angular/core';
import {TabsComponent} from 'src/app/tabs/tabs/tabs.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {IFormVisbilityService} from 'src/app/services/i-form-visbility.service';
import {NgForm} from '@angular/forms';
import {InputService} from 'src/app/services/input.service';
import {TableService} from 'src/app/services/table.service';
import {TestComponentComponent} from 'src/app/components/test-component/test-component.component';
import {AppComponent} from 'src/app/app.component';

declare var opall: any;
import {UploadFileService} from 'src/app/services/upload-file.service';
import {FileUploader} from 'ng2-file-upload';
import {NotificationsService} from 'angular2-notifications';
import {AppConfigServiceService} from '../../services/app-config-service.service'
import * as fileSaver from 'file-saver';

const URL = '';

@Component({
  selector: 'app-enquiry-edit',
  templateUrl: './enquiry-edit.component.html',
  styleUrls: ['./enquiry-edit.component.scss']
})
export class EnquiryEditComponent implements OnInit {
  maxChars = 255;
  showOpall: boolean = false;
  chars = 0;
  tempComment: any = []
  tempAction: any = []
  showDocPane: boolean = false
  historyDisplayFLag: boolean = false
  WIhistoryDisplayFLag: boolean = false
  VhistoryDisplayFLag: boolean = false
  SwapLinkDisplayFLag: boolean = false
  CallbackAmendmentLinkDisplayFLag: boolean = false
  UtilizationReversalDisplayFlag: boolean = false
  @Input() instruction;

  modalID: string
  url: any
  dfxURL: any
  showWindow = false;
  jspPage: any
  private reqBody: any;
  minimized: boolean;
  DisabledButtonForm2: boolean;
  pdf_src: SafeResourceUrl;
  @ViewChild('form', {static: false}) postForm: NgForm;
  @ViewChild('frame', {static: false}) iframe: ElementRef;
  commentHistory: any = []
  versionHistory: any = []
  swapLink: any = []
  callbackAmendmentHistoryLink: any = []
  utilizationReversalHistoryLink: any =[]
  chCreatedBy: any
  chCreatedDate: any
  chTransactionID: any
  public loading = false

  GetDoc = AppConfigServiceService.settings.Document.GetDocument
  Download = AppConfigServiceService.settings.Document.Download
  Opall = AppConfigServiceService.settings.Document.Opall
  ViewAnnotation = AppConfigServiceService.settings.Document.ViewAnnotation
  WriteAnnotation = AppConfigServiceService.settings.Document.WriteAnnotation
  OpAllJSP = AppConfigServiceService.settings.Document.OpAllJSP;
  limit = AppConfigServiceService.settings.Document.UploadLimit
  SupportedFormats = AppConfigServiceService.settings.Document.SupportedFormats;
  volumeindex = AppConfigServiceService.settings.Document.VolumeIndex;
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
  @ViewChild('instructionEdit', {static: false}) editInsTemplate;
  @ViewChild(TabsComponent, {static: false}) TabsComponent;
  @ViewChild('frame2', {static: false}) frame2: ElementRef;
  @Output() itemSelected = new EventEmitter<any>();
  docs = [];
  uploadLimit: number = 10;
  Limit: number = 10;
  userName = JSON.parse(sessionStorage.getItem("currentUser")).userName;
  userDBId = JSON.parse(sessionStorage.getItem("currentUser")).sessionID;
  userIndex = JSON.parse(sessionStorage.getItem("currentUser")).userIndex;
  documentList: any = []
  dropdownlist: any = []
  tempDocumentList: any = []
  CheckInfile: File;
  CheckInfileName: any;
  window_url: string = '';
  downloadableURL = {};
  invaliddocflag: boolean = false;
  opallview: string;
  statuscode: any = 16;
  nofpages: any;
  annotationurl: any;
  writeannotationurl: any;
  selectedDocIndex: any = 0;
  CheckOutFlag: any;
  CheckOutFlag1: any;
  url1: any
  allChecked = false;
  checkbox1 = [];
  filesize = [];
  filesizeunit = [];
  CheckINOUTFlag: string = "0";
  url11: SafeResourceUrl;
  url_ImageFileName: any
  selectedFiles: FileList;
  selectedFilesBrowse: FileList;
  currentFileUpload: File;
  type = [];
  ind = 0;
  optionIsNull = true;
  processinstid: any = '';
  progress: { percentage: number } = {percentage: 0};
  submitted = false;
  VersionType: any = 'Major';
  uploadTypes = [];
  uploadTypestemp = [];
  WIhistory = [];
  Vhistory = [];
  Swaplink = [];
  CallbackAmendmentHistoryLink = [];
  UtilizationReversalHistoryLink = [];   
  selectedDoc: any = "Select";
  opallframeflag: boolean = false;
  documents: any = []
  files = [];
  docutype = [];
  temfiles = [];
  temfiles1 = [];
  temdocutype = [];
  activityid: any;
  src: any;
  private reqBody1: any;
  DisabledButtonForm21: boolean;
  frameid: any
  DocFrameid: any;
  frameindex: any
  frameindex1: any;
  showPortal = false;
  req: JSON
  jspPage1: any
  docExists: boolean = false;
  ToShow: any = 0;
  TransactionType: any = '';
  TransactionTypeSubType: any = '';
  Branch: any = '';
  Product: any = '';
  SourceFlag: any = '';

  public sanitizedSource: SafeResourceUrl;

  TransactionSubType: any = '';
  productCode: any = '';
  displayFlag: boolean = true;
  isDFX: boolean = false;
  ErrorMsg: boolean = true;
  msg = '';
  public windowReference: any;

  constructor(private zone: NgZone, private tableService: TableService, private sanitizer: DomSanitizer,
              private data: IFormVisbilityService, private notif: NotificationsService, private http: HttpClient,
              private uploadService: UploadFileService, private r: ComponentFactoryResolver,
              private viewContainerRef: ViewContainerRef, public inputService: InputService) {
    //this.url11 = sanitizer.bypassSecurityTrustResourceUrl(this.Opall);
    window['subscribeToAlert1'] = (TransactionType, TransactionTypeSubType, Branch,
                                   Product, SourceFlag, processinstid) => {
      zone.run(() => {
        this.getUploadTypes();
      });
    };
    window['subscribeToOpenDoc'] = (UploadTypes) => {
      zone.run(() => {
        console.log('inside openDoc con')
        console.log('From Ifrom', UploadTypes)
        this.uploadTypes = [];
        this.uploadTypes[0] = UploadTypes
        this.openDoc()
      });
    };
  }

  getSourceURL(): SafeResourceUrl {
    if (this.window_url != undefined && this.window_url != '') {
      this.showOpall = true;
      return this.sanitizedSource;
    } else {
      this.showOpall = false;
    }

  }

  loadAlert() {
    this.src = this.window_url; //this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
    //this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.Opall);
    //this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.Opall);

    console.log("Inside loadAlert 2......", this.TransactionType, this.TransactionTypeSubType, this.Branch, this.Product);
    console.log('Instruction details', this.instruction);
    this.documentList = this.instruction.DocList;
    this.uploadTypes = this.instruction.uploadTypes;
    this.activityid = this.instruction.activityid;
    console.log('Doc List......', this.documentList);
    console.log('Upload Types......', this.uploadTypes);
    console.log('activityid......', this.activityid);
    this.ToShow = 0;
    this.setopallfalg();
    var frames = window.frames;
    var i;
    console.log("Frames on load alert", frames.length);
    for (i = 0; i < frames.length; i++) {
      console.log("Frame ", i, window.frames[i].frameElement['name']);
      if (window.frames[i].frameElement['name'] == this.frameid) {
        this.frameindex = i;
        this.processinstid = window.frames[i].frameElement['name'];
        this.processinstid = this.processinstid.substring(5, this.processinstid.length);
        console.log('ProcessInstId', this.processinstid);
        console.log("Breaks at Frame Index", i);
        break;
      }
    }
    this.TransactionType = this.instruction.TransactionTypeCode;
    this.TransactionTypeSubType = this.instruction.TransactionSubTypeCode;
    this.Branch = this.instruction.BranchCode;
    this.Product = this.instruction.ProductCode;
    this.SourceFlag = this.instruction.SourceFlag;
    console.log("values from backend...", this.Branch, this.Product, this.TransactionType, this.TransactionTypeSubType);
    this.modelID = 'model' + this.processinstid;
    this.modelIdDoclist = this.processinstid + 'edit';
    this.modelIDCheckOUT = this.processinstid + 'checkout';
    this.modelIDCheckIN = this.processinstid + 'checkin';
    this.modelIDVersion = this.processinstid + 'version';
  }

  activeTab = 'commentshis';

  wihis(activeTab1) {
    this.activeTab = activeTab1;
  }

  comhis(activeTab2) {
    this.activeTab = activeTab2;
  }

  vhis(activeTab3) {
    this.activeTab = activeTab3;
  }

  swap(activeTab4) {
    this.activeTab = activeTab4;
  }

  callBackAmendmentHistory(activeTab5) {
    this.activeTab = activeTab5;
  }

  utilizationReversalHistory(activeTab6){
    this.activeTab=activeTab6;
  }

  ngOnInit() {
    this.src = this.window_url;
    //this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.Opall);
    //this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.Opall);

    this.commentHistory = []
    this.modalID = this.instruction.pid + "popup"
    console.log('comment history transaction id', this.instruction.transactionID)
    this.productCode = InputService.input.productCode;
    this.isDFX = (this.productCode.toLowerCase() === 'dfx');

    if (this.isDFX) {
      this.url = AppConfigServiceService.settings.IForms.DFX_IForm;
    } else {
      this.url = AppConfigServiceService.settings.IForms.IForm;
    }
    this.minimized = true;
    this.pdf_src = this.url //this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.data.currentMessage.subscribe(message => this.minimized = message)
    this.documentList = this.instruction['DocList'];
    this.uploadTypestemp = this.instruction['uploadTypes'];
    this.uploadTypes = this.instruction['uploadTypes'];
    this.statuscode = this.instruction['statuscode'];
    console.log('Oninit Doc List......', this.documentList);
    console.log('Oninit Upload Types......', this.uploadTypes);
    this.frameid = 'frame' + this.instruction.pid;
    this.DocFrameid = 'docframe' + this.instruction.pid;
    //this.finurl = this.sanitizer.bypassSecurityTrustResourceUrl(this.Opall) + '?url_ImageFileName=';
    this.finurl = this.Opall + '?url_ImageFileName=';
    this.ToShow = 0;
    //this.setopallfalg();
    this.checkbox1[0] = true;
    //var frames = window.frames;
    //var i;
    //console.log("Oninit frames length", frames.length);
    this.resetCheck(0);
    this.loadAlert();
  }

  setCommentsHistoryFlag() {
    this.tempComment = []
    this.commentHistory = []
    this.tempAction = []
    this.WIhistory = []

    console.log("Inside setCommentsHistoryFlag");
    if (this.instruction.transactionID == null || this.instruction.transactionID == undefined || this.instruction.transactionID == '') {
      this.historyDisplayFLag = false;
    } else {
      this.tableService.getCommentHistory(this.instruction.transactionID).subscribe(data => {

        console.log('comment instruction id', this.instruction.transactionID)
        this.commentHistory = []
        console.log('comment history', this.commentHistory)
        console.log('comment history data', data['result'])
        this.tempComment = data['result']
        console.log('comment history ', this.commentHistory)
        console.log('temp commengt', this.tempComment)
        if (this.tempComment.length !== 0) {

          this.commentHistory = data['result']
          this.chCreatedBy = this.commentHistory[0].CreatedbyName

          console.log('comment history after', this.commentHistory)

          if (this.chCreatedBy.match(/^([^@]*)@/) !== null && this.chCreatedBy.match(/^([^@]*)@/) !== undefined && this.chCreatedBy.match(/^([^@]*)@/) !== '' && this.chCreatedBy.match(/^([^@]*)@/) !== 'null') {
            this.chCreatedBy = this.chCreatedBy.match(/^([^@]*)@/)[1]
            var re = /[_.]/g;
            var newstr = this.chCreatedBy.replace(re, " ");
            console.log('sdsdsdsd', newstr)
            console.log('sdsdsdsd', newstr.split(" "))
            this.chCreatedBy = ''
            for (let i in newstr.split(" ")) {
              console.log('this', newstr.split(" ")[i])
              this.chCreatedBy = this.chCreatedBy + newstr.split(" ")[i].charAt(0).toUpperCase() + newstr.split(" ")[i].slice(1) + " "
            }
          } else {
            this.chCreatedBy = this.chCreatedBy.charAt(0).toUpperCase() + this.chCreatedBy.slice(1)
          }

          this.chCreatedDate = this.commentHistory[0].Createddatetime
          this.chTransactionID = this.commentHistory[0].Transaction_Id
          this.historyDisplayFLag = true
        }

      })

      if (this.isDFX) {
        this.tableService.getVersionHistory(this.instruction.transactionID, this.instruction.contractNo).subscribe(data => {
          this.VhistoryDisplayFLag = false;
          this.versionHistory = []
          if (data.result.length !== 0) {
            this.VhistoryDisplayFLag = true;
            this.versionHistory = data.result;
          }
        })
      }

      if (this.isDFX) {
        this.tableService.getSwapLink(this.instruction.transactionID, this.instruction.contractNo).subscribe(data => {
          this.SwapLinkDisplayFLag = false;
          this.swapLink = []
          this.TransactionSubType = this.getTransSubType();
          if (data.result.length !== 0) {
            this.SwapLinkDisplayFLag = true;
            this.swapLink = data.result;
          }
        })
      }
      if (this.isDFX) {
        this.tableService.getCallbackAmendmentHistoryLink(this.instruction.pid).subscribe(data => {
          this.CallbackAmendmentLinkDisplayFLag = false;
          this.CallbackAmendmentHistoryLink = []
          if (data.result.length !== 0) {
            this.CallbackAmendmentLinkDisplayFLag = true;
            this.callbackAmendmentHistoryLink = data.result;
          }
        })
      }
      if (this.isDFX) {
        this.tableService.getUtilizationReversalHistoryLink(this.instruction.pid).subscribe(data => {
          this.UtilizationReversalDisplayFlag = false;
          this.UtilizationReversalHistoryLink = []
          if (data.result.length !== 0) {
            this.UtilizationReversalDisplayFlag = true;
            this.utilizationReversalHistoryLink = data.result;
          }
        })
      }
    }

    this.uploadService.getWIHistory(this.instruction.pid, "0", this.userDBId).subscribe(data => {

      this.tempAction = data[0]['result']['history']
      console.log('getWIHistory', this.WIhistory);
      if (this.tempAction.length !== 0) {
        this.WIhistory = data[0]['result']['history'];
        this.WIhistoryDisplayFLag = true
      }
      var graphElem = document.querySelector('.timeline');
      graphElem.setAttribute('data-height', '100px');
    });
  }

  ngAfterViewInit() {
    this.loadAlert();
    console.log('values on ngafterviewinit.....', this.modelID, this.modelIdDoclist, this.modelIDCheckOUT, this.modelIDCheckIN, this.modelIDVersion);
    this.postForm.ngSubmit.emit();
  }

  changeVisibility() {
    this.minimized = !this.minimized
    this.newMessage();
  }

  newMessage() {
    this.data.changeMessage(this.minimized)
  }

  closeWindow() {
    this.showWindow = !this.showWindow;
    this.minimized = true;
  }

  submitForm($event): boolean {
    $event.stopPropagation();
    this.http.post(this.url, this.reqBody).subscribe(
      data => {
      });
    return true;
  }

  onSubmit() {


    this.reqBody = new FormData();

    this.reqBody.append('attr', this.instruction['attributeData'])
    this.reqBody.append('genData', this.instruction['generalData'])

    let params = new HttpParams();
    params.append('attr', this.instruction['attributeData']);
    params.append('genData', this.instruction['generalData']);

    const headers = new HttpHeaders().set('Content-Type', 'application/json;charset=utf-8');

    const responseType: any = "text";
    const options = {
      headers: headers,
      params: params,
      reportProgress: true,
      responseType: responseType,
    };

    const req = new HttpRequest('POST', this.url, {
      attr: this.instruction['attributeData'],
      genData: this.instruction['generalData'],
      pid: this.instruction['pid'],
      roleID: this.instruction['roleID'],
      userCategoryName: this.instruction['userCategoryName'],
      SessionId: this.userDBId

    }, options);
    this.http.request(req).subscribe(
      data => {
        if (data['body']) {

          this.jspPage = data['body'];
          let content = data['body'];
          let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
          doc.open();
          doc.write(content);
          doc.close();
        }
      }, (err) => {
        console.log('err', err)
      });
  }

  precheck: boolean = false;

  preCheck(flagval: boolean) {

    this.temfiles = [];
    this.docext = [];
    this.filesize = [];
    this.filesizeunit = [];
    this.temfiles1 = [];
    this.precheck = flagval;
    this.uploadTypes = this.uploadTypestemp;
    this.checkTransType();
  }


  getTransSubType() {
    var frames1 = window.frames;
    var i1;
    var subtype;

    for (i1 = 0; i1 < frames1.length; i1++) {
      if (window.frames[i1].frameElement['name'] == this.frameid) {
        this.frameindex1 = i1;
        break;
      }
    }
    subtype = window.frames[this.frameindex1].document.getElementById('Sub_Product_ID')['value']
    console.log("TransactionSubType: ", subtype)
    return subtype;
  }

  checkTransType() {
    console.log('Inside checkTransType');
    var frames = window.frames;
    var i;

    for (i = 0; i < frames.length; i++) {
      console.log("Frame ", i, window.frames[i].frameElement['name']);
      if (window.frames[i].frameElement['name'] == this.frameid) {
        this.frameindex = i;
        console.log("Breaks at Frame Index", i);
        break;
      }
    }

    this.Branch = window.frames[this.frameindex].document.getElementById('BranchCode')['value']

    this.Product = window.frames[this.frameindex].document.getElementById('BusinessCategoryCode')['value']

    this.TransactionType = window.frames[this.frameindex].document.getElementById('TransactionTypeCode')['value']

    this.TransactionTypeSubType = window.frames[this.frameindex].document.getElementById('TransactionSubTypeCode')['value']

    console.log("values....", this.Branch, this.Product, this.TransactionTypeSubType, this.TransactionTypeSubType);

    if (this.TransactionType == '' || this.TransactionType == undefined || this.TransactionType == null
      || this.TransactionType == 'Select') {
      this.displayFlag = false;

      this.notif.warn(
        'Info',
        AppConfigServiceService.settings.WarningMessages.SelectType, {
          timeOut: 5000,
          showProgressBar: false,
          pauseOnHover: true,
          clickToClose: true,
          maxLength: 100
        }
      )

    } else {

      this.displayFlag = true;
    }
    if (this.precheck) {
      this.getUploadTypes();
    }
  }

  showWindow1(version) {
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
    //mapInput.value = this.window_url;
    if (version != undefined) {
      mapInput.value = this.window_url + "&versionNumber=" + version;
    } else {
      mapInput.value = this.window_url;
    }

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

    var mapInput5 = document.createElement("input");
    mapInput5.type = "hidden";
    mapInput5.name = "jspURL";
    mapInput5.value = this.Opall;

    mapForm.appendChild(mapInput);
    mapForm.appendChild(mapInput1);
    mapForm.appendChild(mapInput2);
    mapForm.appendChild(mapInput3);
    mapForm.appendChild(mapInput4);
    mapForm.appendChild(mapInput5);

    document.body.appendChild(mapForm);

    this.windowReference = window.open("", "Map", "status=0,title=0,height=10000,width=10000,scrollbars=1");

    if (this.windowReference) {
      mapForm.submit();
    } else {
      alert('You must allow popups for this map to work.');
    }
  }


  finurl: any;

  /*downloadDoc() {
    this.uploadService.downloadDoc(this.window_url + "&DownloadFlag=Y").subscribe(data => {

    })
  }*/
  downloadDoc() {
    this.docs = [];
    var downloadDocName: string = "";
    var i: number = 0;
    console.log(this.downloadableURL);
    for (const key in this.downloadableURL) {
      console.log(this.downloadableURL[key]);
      downloadDocName = this.downloadableURL[key].name + "." + this.downloadableURL[key].docExt;
      this.docs[i] = this.downloadableURL[key];
      i++;
    }
    console.log('docs ', this.docs);
    this.uploadService.documentDownload(this.userDBId, this.docs).subscribe(data => {
      //console.log(data);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(data[0], downloadDocName);
      } else {
        var anchor = document.createElement("a");
        anchor.download = downloadDocName;
        anchor.href = window.URL.createObjectURL(data[0]);
        anchor.click();
      }
    });
  }

  getProcessInstanceId() {
    if (this.processinstid !== null) {
      return this.processinstid;
    } else if (this.DocFrameid != null) {
      return (this.DocFrameid).substring(7, this.DocFrameid.length);
    } else {
      console.log("Process instance id does not exists!");
      return "";
    }
  }

  supportFlag: any = false;

  showDoc(docs) {
    console.log('start of showdoc method before if');
    if (docs >= 0) {
      this.showDocPane = true;
      console.log('start of showdoc method in if');
      this.checkOutSuccess = false;
      this.checkOutError = false;
      this.UndoSuccess = false;
      this.UndoError = false;

      this.CheckInfile = null;
      this.CheckInfileName = "";
      if (docs >= 0) {
        this.showOpall = true;
      }
      if (this.documentList[docs].checkOutFlag == 'Y')
        this.CheckOutFlag = true;
      else
        this.CheckOutFlag = false;
      this.selectedDocIndex = docs;
      //this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.Opall);

      if ((this.documentList[docs].documentType == 'I' || (this.documentList[docs].documentType == 'N' && this.documentList[docs].documentExt.toLowerCase() == 'pdf')) && !(this.documentList[docs].documentExt.toLowerCase() == 'bmp' || this.documentList[docs].documentExt.toLowerCase() == 'png')) {
        this.supportFlag = true;

        var comment = this.documentList[docs].comment

        console.log('comment', comment.indexOf("%26"))
        if (comment.indexOf("%26") == -1) {
          comment = comment.replace("%", "%25")
        }

        this.opallview = "Y"
        console.log('this.GetDoc 553: ' + this.GetDoc);
        opall.PARAM.url_ImageFileName = this.GetDoc + 'WebApiRequestRedirection?Application=viewDoc&cabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&S=S&Userdbid=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&sessionIndexSet=false&DocumentId=' + this.documentList[docs].documentIndex;
        console.log('this.GetDoc 555: ' + opall.PARAM.url_ImageFileName);
        //this.window_url = this.GetDoc + '?ImgIndex=' + this.documentList[docs].imageIndex + '&VolIndex=' + this.volumeindex + '&DocExt=' + this.documentList[docs].documentExt + '&PageNo=1&docType=' + this.documentList[docs].documentType + '&DocSize=' + this.documentList[docs].documentSize + '&ArchivalMode=&ArchivalCabinet=&wid=&pid=&taskid=&DMSSessionId=&EngineName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&DocumentName=' + comment + '.' + this.documentList[docs].documentExt;
        console.log('in showDoc before forming web api url: ', this.GetDoc);
        this.window_url = this.GetDoc + 'WebApiRequestRedirection?Application=viewDoc&cabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&S=S&Userdbid=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&sessionIndexSet=false&DocumentId=' + this.documentList[docs].documentIndex;
        console.log('in showDoc formed web api url: ', this.window_url);
        this.sanitizedSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
        //this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
        //window.open(this.window_url);
        //this.url11 = this.window_url;
        this.downloadURL = this.window_url + "&DownloadFlag=Y";
        /*opall.PARAM.NumberOfPages = this.documentList[docs].noOfPages;

  opall.PARAM.watermarkPrinting = 4;
  opall.PARAM.ServerSupportMultiPage = true;
  opall.PARAM.num_VisiblePage = 1;
  opall.PARAM.bValidateURLContext = false;
  opall.PARAM.AnnotationDisplay = true;
  opall.PARAM.toolbarVersion = 1;
  opall.PARAM.CurrentUserName = this.userName
  opall.PARAM.URL_Annotation = this.ViewAnnotation + '?DocId=' + this.documentList[docs].documentIndex + '&Version=' + this.documentList[docs].documentVersionNo + '&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&PageNo=1&isadmin=true&loginuser=' + JSON.parse(sessionStorage.getItem("currentUser")).userName;
  console.log('view...', opall.PARAM.URL_Annotation);
  opall.PARAM.url_WriteAnnotation = this.WriteAnnotation + '/DocId=' + this.documentList[docs].documentIndex + '&Option=SaveAnnot&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&J2EE=1&StampDocImagePath=/stamps/AllImages/temp/&StampIniPath=/stamps/conf/&StampImagePath=/stamps/AllImages/&Encoding=UTF-8&stampNewIni=stamp.ini&PageNo=1';
  console.log('write...', opall.PARAM.url_WriteAnnotation);


  if (this.documentList[docs].checkOutFlag == "Y") {
    opall.PARAM.AnnotationOption = 1;
  }
  else {
    opall.PARAM.AnnotationOption = 0;
  }

  this.annotationurl = opall.PARAM.URL_Annotation;
  this.writeannotationurl = opall.PARAM.url_WriteAnnotation;
  this.nofpages = this.documentList[docs].noOfPages;
  this.CheckINOUTFlag = opall.PARAM.AnnotationOption;
        this.checkbox1[docs] = true;*/
        console.log('before calling resetcheck');
        this.resetCheck(docs);
        console.log('after calling resetcheck');
        // opall.showViewer(document.getElementById(this.DocFrameid), this.Opall, '', '');
        //this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
      } else {
        console.log('this.GetDoc 588: ' + this.GetDoc);
        this.window_url = this.GetDoc + 'WebApiRequestRedirection?Application=viewDoc&cabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&S=S&Userdbid=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&sessionIndexSet=false&DocumentId=' + this.documentList[docs].documentIndex;
        console.log('this.GetDoc 590: ' + this.window_url);
        this.sanitizedSource = this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
        //	window.open(this.window_url);
        if (this.documentList[docs].documentExt != 'csv' && this.documentList[docs].documentExt != 'ods'
          && this.documentList[docs].documentExt != 'odt') {
          this.supportFlag = false;
          //this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
        } else {
          this.supportFlag = true;
        }
        this.url11 = this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);

        this.opallview = "N";
        this.downloadURL = this.window_url + "&DownloadFlag=Y";
      }

      this.checkbox1[docs] = true;
      this.resetCheck(docs);
      console.log('end of showdoc method');
    } else {
      console.log('end of showdoc method in else setting  window url to empty');
      this.window_url = '';
      this.showDocPane = false;
    }
  }

  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    console.log(this.processinstid);
    if ((this.processinstid).slice(0, 1) == 'T') {
      var url = "/EPIXTreasuryForm/components/viewer/cleanSession.jsp?pid=" + this.processinstid
        + "&wid=1&taskid=&fid=Form_" + this.processinstid + "_1&WD_SID=null&WD_RID=&ps=Y";
      this.tableService.getCleanSession(url);
      console.log(url);
    } else if ((this.processinstid).slice(0, 1) == 'D') {
      var url = "/SMBC_DFX/components/viewer/cleanSession.jsp?pid=" + this.processinstid +
        "&wid=1&taskid=&fid=Form_" + this.processinstid + "_1&WD_SID=null&WD_RID=&ps=Y";
      this.tableService.getCleanSession(url);
      console.log(url);
    } else {
      console.log("Both condition failed");
    }
    console.log("closing the document links");
    console.log("window close :", this.windowReference);
    if (this.windowReference == undefined || this.windowReference == "undefined" || this.windowReference == '') {
      console.log("closing::");
    } else {
      this.windowReference.close();
    }
  }

  onSubmit1() {

    event.preventDefault();
    this.reqBody1 = new FormData();


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
          this.jspPage1 = data['body'];
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

  async CheckOutDocument(CheckFlag: any) {
    this.checkOutSuccess = false;
    this.checkOutError = false;
    this.UndoSuccess = false;
    this.UndoError = false;

    this.uploadService.checkOutDocument(this.documentList[this.selectedDocIndex].documentIndex, this.documentList[this.selectedDocIndex].imageIndex, CheckFlag, this.processinstid, this.documentList[this.selectedDocIndex].documentName + "(" + this.documentList[this.selectedDocIndex].comment + ")").toPromise().then(data => {
      this.res = data;
      if (this.res['status'] == 200) {
        if (CheckFlag == 'Y') {
          this.checkOutSuccess = true;
          this.checkOutError = false;


          this.notif.success(
            'Success',
            this.documentList[this.selectedDocIndex].comment + '.' + this.documentList[this.selectedDocIndex].documentExt + ' Document Checked Out Successfully', {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            }
          )
          this.getWIHistory();

        }
        if (CheckFlag == 'U') {
          this.UndoSuccess = true;
          this.UndoError = false;

          this.notif.success(
            'Success',
            this.documentList[this.selectedDocIndex].comment + '.' + this.documentList[this.selectedDocIndex].documentExt + ' Undo CheckOut Successful', {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            }
          )
        }
      }
    }, (error) => {
      if (CheckFlag == 'Y') {
        this.checkOutSuccess = false;
        this.checkOutError = true;

      }
      if (CheckFlag == 'U') {
        this.UndoSuccess = false;
        this.UndoError = true;
      }
    });

    this.ToShow = this.selectedDocIndex;
    this.getWorkitemData();
    this.showDoc(this.selectedDocIndex);
  }

  saveFile(data: any, filename?: string) {
    const blob = new Blob([data], {type: 'application/octet-stream'});
    fileSaver.saveAs(blob, filename);
  }

  downloadURL: any;


  async CheckInDocument() {
    await this.uploadService.checkInDocument(this.documentList[this.selectedDocIndex].documentIndex, this.VersionComments, this.documentList[this.selectedDocIndex].documentExt, this.CheckInfile, this.VersionType, this.processinstid, this.documentList[this.selectedDocIndex].documentName + "(" + this.documentList[this.selectedDocIndex].comment + ")")
      .toPromise().then(data => {

          if (data['status'] == 200) {
            this.notif.success(
              'Success',
              this.documentList[this.selectedDocIndex].comment + '.' + this.documentList[this.selectedDocIndex].documentExt + ' CheckedIn Successfully', {
                timeOut: 5000,
                showProgressBar: false,
                pauseOnHover: true,
                clickToClose: true,
                maxLength: 100
              }
            )
          }
          this.getWIHistory();
        }, (error) => {
          this.notif.error(
            'Error',
            this.documentList[this.selectedDocIndex].comment + ' CheckIn Failed', {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            }
          )
        }
      );

    this.ErrorMsg = true;
    this.CheckInfile = null;
    this.CheckInfileName = '';
    this.VersionComments = '';
    this.VersionType = 'Major';
    this.getWorkitemData();
  }

  versionList: any = [];

  Versions() {
    this.uploadService.getVersions(this.documentList[this.selectedDocIndex].documentIndex, "0", "10").subscribe(
      data => {
        this.versionList = data[0]['result']['versionlist'];
      });
  }

  async Delete() {
    await this.uploadService.deleteDocument(this.documentList[this.selectedDocIndex].documentIndex, this.documentList[this.selectedDocIndex].parentFolderIndex, this.processinstid, this.documentList[this.selectedDocIndex].documentName + "(" + this.documentList[this.selectedDocIndex].comment + ")").toPromise().then(
      data => {
        this.getWorkitemData();
        console.log('Delete Doc Response', data['status']);
        if (data['status'] == 200) {
          this.notif.success(
            'Success',
            this.documentList[this.selectedDocIndex].comment + '.' + this.documentList[this.selectedDocIndex].documentExt + ' Deleted Successfully', {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            });
          console.log('to hide document as delete successful');
          this.showDocPane = false;
          this.getWIHistory();
        }
      }
      , (error) => {
        this.getWorkitemData();
        this.notif.error(
          'Error',
          'Unable to delete document ' + this.documentList[this.selectedDocIndex].comment + '.' + this.documentList[this.selectedDocIndex].documentExt, {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          });
        console.log('still to show document as delete failed');
        this.showDocPane = true;
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
    console.log('length of browse....', this.selectedFilesBrowse.length);
    if (this.selectedFilesBrowse.length > 0) {
      console.log('length of browse1111....', this.selectedFilesBrowse.length);
      this.temfiles1.push(this.selectedFilesBrowse[0]);
      this.temfiles.push(this.selectedFilesBrowse[0]);
    }

    if (this.selectedFilesBrowse.length > 0 || this.selectedFilesBrowse[0].name != '' && this.selectedFilesBrowse[0].name != null || this.selectedFilesBrowse != null) {

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
        if (SupFormat[i] == CurrentDocFormat[CurrentDocFormat.length - 1].toLowerCase()) {
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
            'Error',
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
            'Error',
            this.temfiles1[k].name + ' this.temfiles1[k].name  : Cannot Find File size', {
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
            'Error',
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

    await this.uploadService.pushFileToStorage(this.currentFileUpload, this.type[j], this.processinstid).toPromise().then(data => {
      this.res = data;
      this.files.push(this.currentFileUpload);
      this.docutype.push(this.type[j]);
      this.removefromtemparray(this.currentFileUpload, this.type[j]);

      if (this.res['status'] == 200) {
        this.notif.success(
          'Success',
          this.currentFileUpload.name + ' Uploaded Successfully', {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          }
        )
        this.getWIHistory();
      }
    }, (error) => {
    });
  }

  private getWIHistory() {
    this.uploadService.getWIHistory(this.processinstid, "0", this.userDBId).subscribe(data => {

      this.tempAction = data[0]['result']['history'];
      console.log('getWIHistory', this.WIhistory);
      if (this.tempAction.length !== 0) {
        this.WIhistory = data[0]['result']['history'];
        this.WIhistoryDisplayFLag = true;
      }
    });
  }

  getWorkitemData() {
    console.log("Inside getWorkitemData");
    console.log("Inside....", this.processinstid, this.Branch, this.Product, this.TransactionType, this.TransactionTypeSubType);

    this.uploadService.getWorkitemData(this.userDBId, this.processinstid, this.userName, this.Branch,
      this.Product, this.TransactionType, this.TransactionTypeSubType,
      this.SourceFlag).subscribe(
      data => {
        console.log(data);
        this.documentList = data[0]['result']['doucmentList'];
        this.uploadTypestemp = data[0]['result']['uploadTypes'];
        this.uploadTypes = this.uploadTypestemp;
        this.statuscode = data[0]['result']['status'];
        console.log('document user index ', this.documentList)
        if (this.documentList == '' || this.documentList == null || this.documentList == undefined) {
          this.opallframeflag = false;
        } else {
          if (this.documentList.length > 0) {
            this.opallframeflag = true;
            this.showDoc(this.ToShow);
          }
        }
      }
    )
  }

  setopallfalg() {
    if (this.documentList == '' || this.documentList == 'undefined' || this.documentList == undefined) {
      this.opallframeflag = false;
    } else {
      if (this.documentList.length > 0) {
        this.opallframeflag = true;
        this.showDoc(this.ToShow);
      }
    }
  }

  setdropdownlist() {
    for (let i = 0; i < this.dropdownlist.length; i++) {
      if (this.dropdownlist[i].viewAccess)
        this.documentList = this.dropdownlist[i];
    }
  }

  reset1(index: any) {
    this.ToShow = index;

    for (let i in this.documentList) {
      if (index != i) {
        this.checkbox1[i] = false;
        delete this.downloadableURL[i];
      }
    }
    //this.showDoc(this.ToShow);
    this.selectedDocIndex = index;
    console.log('length of downloadableURL ' + Object.keys(this.downloadableURL).length);
    this.downloadableURL[index] = {
      "name": this.documentList[index].comment,
      "docExt": this.documentList[index].documentExt,
      "imageIndex": this.documentList[index].imageIndex
    };
  }

  resetCheck(index: any) {
    console.log('inside resetcheck method');
    for (let i in this.documentList) {
      if (index != i) {
        this.checkbox1[i] = false;
        delete this.downloadableURL[i];
      }
    }
    this.downloadableURL[index] = {
      "name": this.documentList[index].comment,
      "docExt": this.documentList[index].documentExt,
      "imageIndex": this.documentList[index].imageIndex
    };
  }

  showDocVersion(docs) {

    console.log("Inside SHOWdOC vERSION", docs);

    // if (this.versionList[docs].documentType == 'I') {
    //         this.opallview = "Y";
    //         console.log('this.GetDoc 1138: '+this.GetDoc);
    //         this.window_url = this.GetDoc + 'WebApiRequestRedirection?Application=viewDoc&cabinetName='+JSON.parse(sessionStorage.getItem("currentUser")).cabinetName+'&S=S&Userdbid='+ JSON.parse(sessionStorage.getItem("currentUser")).sessionID+'&sessionIndexSet=false&DocumentId='+this.documentList[docs].documentIndex;
    //         //this.window_url=this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url));
    //         console.log('this.GetDoc 1141: '+this.window_url);
    //         this.sanitizedSource=this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
    //   this.annotationurl = this.ViewAnnotation + '?DocId=' + this.documentList[this.selectedDocIndex].documentIndex + '&Version=' + this.versionList[docs].documentVersionNo + '&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&PageNo=1&isadmin=true&loginuser=' + JSON.parse(sessionStorage.getItem("currentUser")).userName;
    //   this.writeannotationurl = this.WriteAnnotation + '/DocId=' + this.documentList[this.selectedDocIndex].documentIndex + '&Option=SaveAnnot&UserDbId=' + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + '&CabinetName=' + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + '&JtsIp=127.0.0.1&JtsPort=3333&J2EE=1&StampDocImagePath=/stamps/AllImages/temp/&StampIniPath=/stamps/conf/&StampImagePath=/stamps/AllImages/&Encoding=UTF-8&stampNewIni=stamp.ini&PageNo=1';

    //   if (this.versionList[docs].checkOutFlag == "Y" || !this.versionList[docs].ModifyAccess || this.statuscode == '16') {
    //     this.CheckINOUTFlag = "1";
    //   }
    //   else {
    //     this.CheckINOUTFlag = "0";
    //   }
    //     } else {
    // 	console.log('this.GetDoc 1150: '+this.GetDoc);
    //         this.window_url = this.GetDoc + 'WebApiRequestRedirection?Application=viewDoc&cabinetName='+JSON.parse(sessionStorage.getItem("currentUser")).cabinetName+'&S=S&Userdbid='+ JSON.parse(sessionStorage.getItem("currentUser")).sessionID+'&sessionIndexSet=false&DocumentId='+this.documentList[docs].documentIndex;
    //         //this.window_url=this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url));
    //   this.opallview = "N";
    //         this.sanitizedSource=this.sanitizer.bypassSecurityTrustResourceUrl(this.window_url);
    // 	console.log('this.GetDoc 1154: '+this.window_url);
    // }

    this.showWindow1(this.versionList[docs].documentVersionNo);
  }

  getUploadTypes() {
    console.log("Inside getUpoadTypes");
    console.log("Inside....", this.processinstid, this.Branch, this.Product, this.TransactionType, this.TransactionTypeSubType);

    this.uploadService.getUploadTypes(this.userDBId, this.processinstid, this.userName, this.Branch, this.Product, this.TransactionType, this.TransactionTypeSubType).subscribe(
      data => {

        console.log("upload types resonse....", data);
        this.uploadTypes = data[0]['result']['uploadTypes'];

      });


  }

  openDoc() {
    this.temfiles = [];
    this.docext = [];
    this.filesize = [];
    this.filesizeunit = [];
    this.temfiles1 = [];
    this.precheck = false;
    this.checkTransType();
    document.getElementById("openDoc").click();

  }

  sessionValidation() {
    this.tableService.sessionValidation()
  }

  openTabForVersion(items) {
    this.itemSelected.emit(items);
  }
}
