import {Component, OnInit, NgZone, ViewChild} from '@angular/core';
import {TabsComponent} from 'src/app/tabs/tabs/tabs.component';
import {DashboardTabsComponent} from 'src/app/tabs/dashboard-tabs/dashboard-tabs.component';
import {WorkItemService} from 'src/app/services/work-item.service';
import {NotificationsService} from 'angular2-notifications';
import {UploadFileService} from 'src/app/services/upload-file.service';
import {AppConfigServiceService} from 'src/app/services/app-config-service.service';

@Component({
  selector: 'app-enquiry-parent',
  templateUrl: './enquiry-parent.component.html',
  styleUrls: ['./enquiry-parent.component.scss']
})
export class EnquiryParentComponent implements OnInit {
  userName = JSON.parse(sessionStorage.getItem("currentUser")).userName;
  userDBId = JSON.parse(sessionStorage.getItem("currentUser")).sessionID;
  @ViewChild('instructionEdit', {static: false}) editInsTemplate;
  @ViewChild(TabsComponent, {static: false}) TabsComponent
  @ViewChild(TabsComponent, {static: false}) tabsComponent;
  @ViewChild(DashboardTabsComponent, {static: false}) DashboardTabsComponent;
  newInstruction = {}
  attributesdata: any
  instructionDetails: any;
  searchFields: any
  generalData: any
  pidData: any
  pid: any
  msg: any
  status: any
  statuscode: any;
  id: string;
  docList = []
  Branch: any
  activityid: any;
  workItemId: any;
  contractNo: any;
  Product: any
  TransactionType: any
  TransactionTypeSubType: any
  uploadTypes = []
  inst = {
    TransactionID: "",
    LockStatus: "",
    sessionID: "",
    processInstanceId: "",
    UserName: "",
    DocList: "",
    UserCategoryName: "",
    contractNo: ""
  }
  public loading = false

  constructor(private zone: NgZone, private uploadFileService: UploadFileService, private workItemService: WorkItemService, private notif: NotificationsService) {
    window['subscribeToAlert'] = (message, control, type, referenceNo, processInstanceID) => {
      zone.run(() => {
        this.loadAlert(message, control, type, referenceNo, processInstanceID);
      });
    };
  }

  ngOnInit() {
  }

  async createTransaction(event) {
    this.loading = true

    this.inst.TransactionID = ""

    this.inst.sessionID = this.userDBId
    this.workItemService.getNewPid(this.inst.sessionID, event.RoleID, event.UserCategoryName).subscribe(data => {
      this.pidData = data;

      this.pid = this.pidData[0]['result'];

      if (this.pid.toLowerCase() !== 'workflow server down') {
        this.inst.processInstanceId = this.pid;


        this.inst.UserName = this.userName
        this.inst.UserCategoryName = event.UserCategoryName
        this.loadDetails(this.inst);
      } else {
        this.loading = false
        this.notif.error(
          'Error',
          AppConfigServiceService.settings.ErrorMessages.CreatingTransaction, {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          }
        )
      }

    })

  }


  async itemSelected(instruction) {
    console.log('instruction', instruction)
    this.loading = true
    this.inst.TransactionID = instruction.TransactionID
    this.inst.LockStatus = instruction.LockStatus
    this.inst.sessionID = this.userDBId
    this.inst.contractNo = instruction.Contract_No

    this.inst.processInstanceId = instruction.ProcessInstanceID
    this.inst.UserName = this.userName
    this.loadDetails(this.inst);
  }

  loadDetails(inst) {
    this.loading = true
    this.pidData = ''
    this.newInstruction = {}
    this.uploadFileService.getWorkitemData(inst['sessionID'], inst['processInstanceId'], inst['UserName'], null, null, null, null, null, inst["WorkItemId"]).subscribe(data => {

      this.instructionDetails = data[0]['result'];
      this.attributesdata = this.instructionDetails['attributeData']
      this.generalData = this.instructionDetails['generalData']
      this.docList = this.instructionDetails['doucmentList']
      this.msg = this.instructionDetails['msg']
      this.status = this.instructionDetails['status']
      this.Branch = this.instructionDetails['branchCode']
      this.Product = this.instructionDetails['productCode']
      this.TransactionType = this.instructionDetails['transactionTypeCode']
      this.TransactionTypeSubType = this.instructionDetails['transactionSubTypeCode']
      this.statuscode = this.instructionDetails['status']
      this.uploadTypes = this.instructionDetails['uploadTypes']
      this.activityid = this.instructionDetails['activityID']
      this.workItemId = this.instructionDetails['workItemId']

      if (this.status === '0' || this.status === '16' || this.status === '32') {
        this.newInstruction['attributeData'] = this.attributesdata;
        this.newInstruction['generalData'] = this.generalData;
        this.newInstruction['pid'] = this.inst.processInstanceId

        this.newInstruction['LockStatus'] = this.inst.LockStatus
        this.newInstruction['transactionID'] = this.inst.TransactionID
        this.newInstruction['BranchCode'] = this.Branch;
        this.newInstruction['ProductCode'] = this.Product;
        this.newInstruction['TransactionTypeCode'] = this.TransactionType;
        this.newInstruction['TransactionSubTypeCode'] = this.TransactionTypeSubType;
        this.newInstruction['DocList'] = this.docList
        this.newInstruction['uploadTypes'] = this.uploadTypes
        this.newInstruction['statuscode'] = this.statuscode
        this.newInstruction['activityid'] = this.activityid
        this.id = this.inst.processInstanceId
        this.newInstruction['id'] = this.id;
        this.newInstruction['workItemId'] = this.workItemId;
        this.newInstruction['contractNo'] = this.inst.contractNo;
        this.newInstruction['userCategoryName'] = this.inst.UserCategoryName

        this.TabsComponent.openTab(
          `${this.newInstruction['transactionID']}`,
          this.editInsTemplate,
          this.newInstruction,
          true
        );
        this.loading = false
      } else {
        this.loading = false
        this.notif.error(
          'Error',
          AppConfigServiceService.settings.ErrorMessages.FetchingTransaction, {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          }
        )
      }
    })
  }

  loadAlert(message, control, type, referenceNo, processInstanceID) {
    if (type == 'Error') {
      this.notif.error(
        'Error',
        message,
        {
          timeOut: 5000,
          showProgressBar: false,
          pauseOnHover: true,
          clickToClose: true,
          maxLength: 100
        }
      )
    } else if (type == 'Success') {
      this.notif.success(
        referenceNo,
        message, {
          timeOut: 5000,
          showProgressBar: false,
          pauseOnHover: true,
          clickToClose: true,
          maxLength: 100
        }
      )

      if (control == 'Submit' && type == 'Success') {
        document.getElementById(processInstanceID).click()
        document.getElementById("openTab").click()
      }
      if (control == 'Discard' && type == 'Success') {
        document.getElementById(processInstanceID).click()
        document.getElementById("openTab").click()
      }
      if (control == 'Approve' && type == 'Success') {
        document.getElementById(processInstanceID).click()
        document.getElementById("openTab").click()
      }
      if (control == 'Reject' && type == 'Success') {
        document.getElementById(processInstanceID).click()
        document.getElementById("openTab").click()
      }
      if (control == 'Cancel' && type == 'Success') {
        document.getElementById(processInstanceID).click()
        document.getElementById("openTab").click()
      }
      if (control == 'ApproveCancellation' && type == 'Success') {
        document.getElementById(processInstanceID).click()
        document.getElementById("openTab").click()
      }
      if (control == 'RejectCancellation' && type == 'Success') {
        document.getElementById(processInstanceID).click()
        document.getElementById("openTab").click()
      }
    }
  }
}
