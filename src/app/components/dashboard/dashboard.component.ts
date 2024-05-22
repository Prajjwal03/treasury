import {Component, OnInit, ViewChild, NgZone} from '@angular/core';
import {HighchartsService} from 'src/app/services/highcharts.service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {TabsComponent} from 'src/app/tabs/tabs/tabs.component';
import {WorkItemService} from 'src/app/services/work-item.service';
import {NotificationsService} from 'angular2-notifications';
import {UploadFileService} from 'src/app/services/upload-file.service';
import {AppConfigServiceService} from 'src/app/services/app-config-service.service';
import {InputService} from 'src/app/services/input.service';
import {TableService} from 'src/app/services/table.service';
import {ChartOptions, ChartType, ChartDataSets} from 'chart.js';
import {Label} from 'ng2-charts';
import {CommonEnquiryService} from 'src/app/services/common-enquiry.service';
import {ReportServiceService} from 'src/app/services/report-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  barChartOrderArray = []
  date: any
  month: any
  year: any
  customRangeFlag: boolean = false
  dateFilter: any = []
  field: any = 'Today'
  tempArray = []
  flag: boolean = false
  teamFlag: boolean = false
  barChartOptions: ChartOptions = {
    legend: {position: 'bottom'},
    hover: {
      animationDuration: 1
    },
    animation: {
      duration: 1,
      onComplete: this.getChart()
    },
    title: {
      text: 'My Individual Performance',
      display: false
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 10,
        }
      }
    },
    responsive: true,
  };
  barChartOptionsTeam: ChartOptions = {
    legend: {position: 'bottom'},
    hover: {},
    animation: {
      duration: 1,
      onComplete: this.getChart()
    },
    title: {
      text: 'My Team Performance',
      display: true
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 10,
        }
      }
    },
    responsive: true,
  };

  barChartLabels: Label[] = []
  barChartLabelsTeam: Label[] = ['Complete', 'InProgress', 'Create'];
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];
  barChartData: ChartDataSets[]
  barChartDataTeam: ChartDataSets[]

  branchName: any = ''
  userIndex = JSON.parse(sessionStorage.getItem("currentUser")).userIndex
  userName = JSON.parse(sessionStorage.getItem("currentUser")).userName;
  userDBId = JSON.parse(sessionStorage.getItem("currentUser")).sessionID;
  myToDo: boolean = false;
  watchList: boolean = false;
  activeTab: string;
  id: string;
  url: any
  msg: any
  status: any
  docList: any
  report_src: SafeResourceUrl;
  sessionId: any
  @ViewChild('instructionEdit', {static: false}) editInsTemplate;
  @ViewChild(TabsComponent, {static: false}) TabsComponent;
  newInstruction = {}
  attributesdata: any
  statuscode: any;
  instructionDetails: any;
  searchFields: any
  generalData: any
  pidData: any
  activityid: any;
  workItemId: any;
  uploadTypes = []
  pid: any
  Branch: any
  Product: any
  TransactionType: any
  TransactionTypeSubType: any
  obj = {};
  config = {
    id: 'TeamTodo_pagination_id',
    itemsPerPage: AppConfigServiceService.settings.Pagination.itemsPerPage,
    currentPage: 1,
    totalItems: 0
  };
  tableDetails = {
    "tableName": "My Team ToDo",
    "userIndex": this.userIndex,
    "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
    "pageNo": 0,
    "count": 0,
    "orderBy": AppConfigServiceService.settings.Pagination.orderBy,
    "sortBy": 'DESC'
  }
  inst = {
    TransactionID: "",
    LockStatus: "",
    sessionID: "",
    processInstanceId: "",
    UserName: "",
    DocList: "",
    RoleID: "",
    UserCategoryName: "",
    WorkItemId: "",
    contractNo: ""
  }
  branchCode: any = ''
  productCode: any = ''
  productName: any = ''

  public loading = false

  constructor(private reportService: ReportServiceService, private commonEnquiryService: CommonEnquiryService, private tableService: TableService, private inputService: InputService, private uploadFileService: UploadFileService, private notif: NotificationsService, private zone: NgZone, private sanitizer: DomSanitizer, private highcharts: HighchartsService, private workItemService: WorkItemService) {
  }

  private getChart() {
    return function () {
      var chartInstance = this.chart, ctx = chartInstance.ctx;
      ctx.textAlign = 'center';
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.textBaseline = 'bottom';

      this.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        meta.data.forEach(function (bar, index) {
          var data = dataset.data[index];
          ctx.fillText(data, bar._model.x, bar._model.y - 5);
        });
      });
    };
  }

  ngOnInit() {
    this.dateFilter = ['Today', 'Last 3 days', 'Last week', 'Month']
  }

  refresh() {
    this.loading = true
    this.myPerformanceChart(this.branchCode, this.productCode, this.branchName, this.productName, this.field)
  }

  loadMyTeamsToDo(tab: any) {
    if (tab == "My To Do") {
      this.myToDo = true;
    } else if (tab == "Watchlist") {
      this.watchList = true;
    }

  }

  async createTransaction(event) {
    this.loading = true
    this.inst = {
      TransactionID: "",
      LockStatus: "",
      sessionID: "",
      processInstanceId: "",
      UserName: "",
      DocList: "",
      RoleID: "",
      UserCategoryName: "",
      WorkItemId: "",
      contractNo: ""
    }
    this.pidData = ''
    this.newInstruction = {}
    this.inst.TransactionID = ""
    this.inst.sessionID = this.userDBId
    this.workItemService.getNewPid(this.inst.sessionID, event.RoleID, event.UserCategoryName).subscribe(data => {
      this.pidData = data;
      this.pid = this.pidData[0]['result'];
      if (this.pid.toLowerCase() !== 'workflow server down') {
        this.inst.processInstanceId = this.pid;
        this.inst.UserName = this.userName
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

    this.inst.TransactionID = instruction.TransactionID
    this.inst.LockStatus = instruction.LockStatus
    this.inst.sessionID = this.userDBId
    this.inst.contractNo = instruction.Contract_No

    this.inst.processInstanceId = instruction.ProcessInstanceID
    this.inst.UserName = this.userName
    this.inst.WorkItemId = instruction.WorkItemId ? instruction.WorkItemId : null;
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

  async myPerformanceChart(branchCode, productCode, branchName, productName, dateFilter) {
    this.loading = true
    this.reportService.getWIPGraphic(branchCode, productCode).subscribe(data => {
      this.barChartLabels = []
      this.tempArray = []
      console.log('wip graph', data)
      this.barChartOrderArray = AppConfigServiceService.settings.WIPGraph.barChartCount
      this.barChartLabels = AppConfigServiceService.settings.WIPGraph.barChartOrder
      console.log('array', this.barChartOrderArray, this.barChartLabels)
      for (let i = 0; i < this.barChartOrderArray.length; i++) {
        console.log(i, this.barChartOrderArray[i])
        console.log(data['result'][this.barChartOrderArray[i]][0]['row_count'])
        console.log("rounding", data['result'][this.barChartOrderArray[i]][0]['row_count'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        this.tempArray.push(data['result'][this.barChartOrderArray[i]][0]['row_count'])
      }
      this.barChartData = [{barPercentage: 0.5, data: this.tempArray, label: ''},]
      this.flag = true
    })

    this.loading = false
  }

  setDropDownType(type) {
    this.field = type
    console.log("datefilter", type)
    this.myPerformanceChart(this.branchCode, this.productCode, this.branchName, this.productName, type)
  }

  setDate(event) {
    console.log('custom range date', event)
  }
}
