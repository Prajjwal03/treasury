import {Component, OnInit, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {TableService} from 'src/app/services/table.service';
import {NotificationsService} from 'angular2-notifications';
import {FormControl} from '@angular/forms';
import {WorkItemService} from 'src/app/services/work-item.service';
import {CommonEnquiryService} from 'src/app/services/common-enquiry.service';
import {AppConfigServiceService} from 'src/app/services/app-config-service.service';
import {InputService} from 'src/app/services/input.service';
import {Subscription} from 'rxjs';
import {DatePipe} from '@angular/common'

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.scss']
})
export class WatchListComponent implements OnInit {

  examplearaay: any = []
  exampleobjJSON = {}
  exampleModalValue: any = []
  dateStr: string
  searchFlag: boolean = true
  modalFlag: boolean = true
  clearFlag: boolean = false
  alertFlag: boolean = false
  maxFilterFlag: boolean = false
  combinationAlertFlag: boolean = false
  isValueTodayDealsEnabled: boolean = false;
  @Input() modalID
  @Input() branchName
  message: any;
  subscription: Subscription;
  createFlag: boolean = false
  @Output() itemSelected = new EventEmitter<any>();
  @Output() createTransaction = new EventEmitter<any>();
  userIndex: number = JSON.parse(sessionStorage.getItem("currentUser")).userIndex
  branch: any = "Select"
  product: any = "Select"
  field: any = "Select"
  modalField: any = "Select"
  modalBodyFilterValues: any = []
  value: any
  modalValue: any = ""
  valueType: any
  roleName: string;
  modalValueType: any
  valueName: any
  modalValueName: any
  tableFlag: boolean = false
  resultFlag: boolean = false
  isChecked = false;
  isDisabled = false;
  valueDateTo: string = '';
  multiSelectDropdown = []
  dropdownSettings = {}
  searchField: any = []
  tableField: any = []
  pageSize: any = 1
  search: string
  dropDownFieldName: string
  dropDownValue: any = []
  dropDownData: any = []
  dropdownDataMap = []
  myTodoData: any = []
  dynamicValue: any
  myTodoDataMap = new Map();
  tempMap = new Map();
  dropDown = {}
  multiSelect = {}
  obj = {};
  tempVar: string
  transactionRefNo: string
  dynamicID: any = []

  myControl = new FormControl();
  customerName = [];
  customerNameTemp: any
  customerId = [];
  customerIdTemp = []
  collection = {count: 0, data: null};

  branchCode: any = ""
  productCode: any = ""
  opens: string;
  drops: string;
  tempValue: number
  modalBodyFilter: any = []
  tableDetails = {
    "branchCode": this.branchCode,
    "productCode": this.productCode,
    "tableName": "My WatchList",
    "userIndex": this.userIndex,
    "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
    "pageNo": 0,
    "count": 0,
    "orderBy": AppConfigServiceService.settings.Pagination.orderBy,
    "sortBy": "DESC"
  }
  config: any = {
    id: 'watch_id',
    itemsPerPage: AppConfigServiceService.settings.Pagination.itemsPerPage,
    currentPage: 1,
    totalItems: 0
  };
  public loading = false

  constructor(private datePipe: DatePipe, private inputService: InputService, private commonEnquiryService: CommonEnquiryService, private workItemService: WorkItemService, private router: Router, private tableService: TableService, private notif: NotificationsService) {
    this.opens = 'right';
    this.drops = 'down';
  }

  async ngOnInit() {
    this.loading = true
    try {
      let data = await this.tableService.getRoleName(this.userIndex).toPromise();
      this.roleName = data[0]['result'];
      console.log('rolename', this.roleName);
    } catch (error) {
      console.error('Error fetching role name:', error);
    }

    if (InputService.input !== undefined) {
      this.branchCode = InputService.input.branchCode
      this.productCode = InputService.input.productCode
      this.config.currentPage = 1
      this.config.totalItems = 0

      if (this.productCode === "DFX"){
        if(this.roleName === 'Operation Maker' || this.roleName === 'Operation Checker' ){
          this.isChecked = true;
          this.isValueTodayDealsEnabled = true;
        } else if (this.roleName === 'Treasury Maker' || this.roleName === 'Treasury Checker' || 
        this.roleName === 'DFX Viewer' || this.roleName === 'DFX App Support') {
          this.isValueTodayDealsEnabled = true;
        }
      }
      this.getCommonEnquiryField(this.branchCode, this.productCode)
      this.loadDetails(true)
    }
    this.getData()
    this.tableService.getCreateFlag(this.userIndex).subscribe(data => {
      this.createFlag = data['result']
    })

  }

  getData() {
    this.inputService.getMessage().subscribe(message => {


      this.message = message
      this.branchCode = this.message.text.branchCode
      this.productCode = this.message.text.productCode
      this.clearSearchField()
      this.getCommonEnquiryField(this.message.text.branchCode, this.message.text.productCode)
      this.tableDetails.pageNo = 0
      this.tableDetails.count = 0
      this.config.totalItems = 0
      this.loadDetails(true)
      this.config.currentPage = 1
    });

  }

  removemodalBodyFilterValues() {
    this.modalBodyFilter = []
    this.modalBodyFilterValues = []
    this.modalValue = []
    this.clearFlag = false
    this.combinationAlertFlag = false
    this.alertFlag = false
    this.dateStr = ""
    this.obj = {}
    this.tableDetails = {
      "branchCode": this.branchCode,
      "productCode": this.productCode,
      "tableName": "My WatchList",
      "userIndex": this.userIndex,
      "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
      "pageNo": 0,
      "count": 0,
      "orderBy": this.getOrderByState(this.productCode),
      "sortBy": "DESC"
    }
    this.onReset()
  }

  onReset() {
    this.maxFilterFlag = false
    this.modalBodyFilter = []
    this.modalFlag = true
    this.searchFlag = true
    this.valueType = "Text"

    this.modalValueType = 'Text'
    this.modalField = "Select"
    this.field = "Select"
    this.modalValue = ""
    this.value = ""
    this.clearFlag = false
    this.modalBodyFilterValues = []
    this.tableFlag = false
    this.obj = {}
    this.isDisabled = false;
    if (this.productCode === "DFX"){
      if(this.roleName === 'Operation Maker' || this.roleName === 'Operation Checker' ){
        this.isChecked = true;
        this.isValueTodayDealsEnabled = true;
      } else if (this.roleName === 'Treasury Maker' || this.roleName === 'Treasury Checker' || 
      this.roleName === 'DFX Viewer' || this.roleName === 'DFX App Support') {
        this.isChecked = false;
        this.isValueTodayDealsEnabled = true;
      } else {
        this.isValueTodayDealsEnabled = false;
      }
    }
    this.config = {
      id: 'Watch_id',
      itemsPerPage: AppConfigServiceService.settings.Pagination.itemsPerPage,
      currentPage: 1,
      totalItems: 0
    };
    this.tableDetails = {
      "branchCode": this.branchCode,
      "productCode": this.productCode,
      "tableName": "My WatchList",
      "userIndex": this.userIndex,
      "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
      "pageNo": 0,
      "count": 0,
      "orderBy": this.getOrderByState(this.productCode),
      "sortBy": "DESC"
    }
    for (let i in this.tempMap) {
      this.tempMap[i] = " "
    }
    this.getCommonEnquiryField(this.branchCode, this.productCode)
    this.loadDetails(false)
  }

  getCommonEnquiryField(branchCode, productCode) {
    this.searchField = []
    this.tableService.getdashboardTableFields(branchCode, productCode, this.userIndex).subscribe(data => {
      this.searchField = []

      if (data[0]['result'] !== "") {
        this.searchField = data[0]['result']
        this.valueType = this.searchField[0].FieldType
        this.field = this.searchField[0].NameToDisplay
        this.modalField = this.searchField[0].NameToDisplay
        this.modalValueType = this.searchField[0].FieldType
      }
    })
  }

  pageChanged(event) {
    this.config.currentPage = event;
    this.tableDetails.count = this.config.totalItems
    this.tableDetails.pageNo = (event - 1) * AppConfigServiceService.settings.Pagination.itemsPerPage
    this.loadDetails(false)
  }

  unChecked(item, dynamicId) {
    if ((document.getElementById(dynamicId) as HTMLInputElement).checked === false) {
      this.transactionRefNo = ''
    } else {
      for (let i in this.dynamicID) {
        this.tempVar = this.dynamicID[i]
        console.log('true', (document.getElementById(this.tempVar) as HTMLInputElement).checked)
        if ((document.getElementById(this.tempVar) as HTMLInputElement).checked) {
          this.transactionRefNo = item
          if (this.tempVar !== dynamicId) {
            (document.getElementById(this.tempVar) as HTMLInputElement).checked = false
          }
        }
      }
    }
  }

  unLockWorkItem() {
    console.log('unlock the id', this.transactionRefNo)
    if (this.transactionRefNo == '' || this.transactionRefNo == undefined) {
      this.notif.warn(
        'Info',
        AppConfigServiceService.settings.WarningMessages.SelectTransaction,
        {
          timeOut: 5000,
          showProgressBar: false,
          pauseOnHover: true,
          clickToClose: true,
          maxLength: 100
        }
      )
    }

    for (let i in this.myTodoDataMap) {
      if (this.myTodoDataMap[i].ProcessInstanceID === this.transactionRefNo) {
        if (this.myTodoDataMap[i].LockStatus === 'N') {

          this.notif.warn(
            'Info',
            AppConfigServiceService.settings.WarningMessages.UnlockWorkItemItem,
            {
              timeOut: 5000,
              showProgressBar: false,
              pauseOnHover: true,
              clickToClose: true,
              maxLength: 100
            }
          )
        } else {
          this.refresh()
          this.workItemService.unlockWorkItem(this.transactionRefNo, this.myTodoDataMap[i].WorkItemId).subscribe(data => {

            this.notif.success(
              'Success',
              'The selected transaction has been unlocked successFully',
              {
                timeOut: 5000,
                showProgressBar: false,
                pauseOnHover: true,
                clickToClose: true,
                maxLength: 100
              }
            )
          })
          this.refresh()
        }
      }

    }
  }

  getOrderByState(productCode) {
    return (("DFX" === productCode) ? AppConfigServiceService.settings.Pagination.orderByDFX : AppConfigServiceService.settings.Pagination.orderBy)
  }

  loadDetails(state) {
    this.loading = true
    this.dynamicID = []
    this.obj['branchCode'] = this.branchCode
    this.obj['productCode'] = this.productCode
    this.tableDetails['branchCode'] = this.branchCode
    this.tableDetails['productCode'] = this.productCode

    if (state === true) {
      this.tableDetails['orderBy'] = this.getOrderByState(this.productCode)
    }

    if(this.searchFlag === true){
      if (this.isValueTodayDealsEnabled === true && this.isChecked === true) {
        let startDate = new Date(AppConfigServiceService.settings.ValueDateToStartDate);
        let currentDate = new Date();
        this.valueDateTo = "Value_Date_To BETWEEN '" +  this.datePipe.transform(startDate, 'MM/dd/yyyy') + "' AND '" +  this.datePipe.transform(currentDate, 'MM/dd/yyyy') + " 23:59:59.998'";
        this.obj['Value_Date_To'] = this.valueDateTo;
        if(this.field === 'Value Date To'){
          this.isDisabled = true;
        }
      } else {
        if (this.obj.hasOwnProperty('Value_Date_To') && this.field !== 'Value Date To'){
          delete this.obj['Value_Date_To']
        }
        this.isDisabled = false;
      }
    }

    this.obj["tableDetails"] = this.tableDetails
    this.tableService.getdashboardColumnTableFields(this.branchCode, this.productCode, this.userIndex).subscribe(data => {

      this.tableField = data[0]['result']
    })
    this.getMyWatchList();
  }

  getRandom(): number {
    return (Math.random())
  }

  sort(fieldName) {
    this.tableDetails['orderBy'] = fieldName.replace(/ /g, "")

    if (this.tableDetails['sortBy'] === 'ASC') {
      this.tableDetails['sortBy'] = "DESC"
    } else {
      this.tableDetails['sortBy'] = "ASC"
    }

    this.tableDetails.pageNo = 0
    this.loadDetails(false)
    this.config.currentPage = 1

  }

  setDate($event) {
    for (let i in this.searchField) {
      if (this.searchField[i].NameToDisplay === this.field) {
        this.value = this.searchField[i].FieldName + " BETWEEN '" + ($event.startDate).format('MM/DD/YYYY') + "' AND '" + ($event.endDate).format('MM/DD/YYYY') + " 23:59:59.998'";
        this.dateStr = this.searchField[i].NameToDisplay + " " + "between" + " " + ($event.startDate).format('DD-MMM-YYYY') + " " + "and" + " " + ($event.endDate).format('DD-MMM-YYYY')
      }
    }
  }

  setDateForModal($event) {
    for (let i in this.searchField) {
      if (this.searchField[i].NameToDisplay === this.modalField) {
        this.obj[this.searchField[i].FieldName] = this.searchField[i].FieldName + " BETWEEN '" + ($event.startDate).format('MM/DD/YYYY') + "' AND '" + ($event.endDate).format('MM/DD/YYYY') + " 23:59:59.998'";
        this.modalValue = this.obj[this.searchField[i].FieldName]
        this.dateStr = this.searchField[i].NameToDisplay + " " + "between" + " " + ($event.startDate).format('DD-MMM-YYYY') + " " + "and" + " " + ($event.endDate).format('DD-MMM-YYYY')
      }
    }
  }

  refresh() {
    this.loading = true
    this.getMyWatchList()
  }

  private getMyWatchList() {
    this.tableService.getMyWatchList(this.obj).subscribe(data => {

      this.myTodoData = data[0]['result']['toDoDetails']
      this.config.totalItems = data[0]['result']['count']
      if (this.config.totalItems === 0) {
        this.resultFlag = true
        this.tableFlag = false
      } else {
        this.tableFlag = true
        this.resultFlag = false
      }
      this.myTodoDataMap = this.myTodoData
      var n = 0

      while (n < this.config.totalItems) {
        this.dynamicID.push(this.getRandom())
        n++
      }

      this.loading = false
    })
  }

  setSearch() {

    if (this.branchCode !== "" && this.productCode !== "") {


      if (this.value !== "" && this.value !== undefined) {
        this.modalFlag = false
        for (let i in this.searchField) {

          if (this.searchField[i].NameToDisplay === this.field && this.searchField[i].FieldType !== "Date") {
            this.obj[this.searchField[i].FieldName] = this.value.trim()
            this.tableDetails.count = 0
            this.tableDetails.pageNo = 0
            this.loadDetails(false)
            this.config.currentPage = 1
          } else if (this.searchField[i].NameToDisplay === this.field && this.searchField[i].FieldType === "Date") {
            this.tableDetails.count = 0
            this.tableDetails.pageNo = 0
            this.obj[this.searchField[i].FieldName] = this.value
            this.loadDetails(false)
            this.config.currentPage = 1
          }
        }
      }
    }
  }

  setDropDownType(field: any) {
    this.value = ""
    this.obj = {}
    this.tableDetails = {
      "branchCode": this.branchCode,
      "productCode": this.productCode,
      "tableName": "My WatchList",
      "userIndex": this.userIndex,
      "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
      "pageNo": 0,
      "count": 0,
      "orderBy": this.getOrderByState(this.productCode),
      "sortBy": "DESC"
    }
    this.dropDownData = []

    for (let i in this.searchField) {
      if (this.searchField[i].NameToDisplay === this.field) {

        if (this.searchField[i].FieldType === "Text") {
          this.valueType = "Text"
        } else if (this.searchField[i].FieldType == "Date") {
          this.valueType = "Date"
          this.value = undefined
          if(this.field === 'Value Date To' && this.isChecked === true){
            this.isDisabled = true;
          } else {
            this.isDisabled = false;
          }
        } else if (this.searchField[i].FieldType == "Auto") {
          this.valueType = "Auto"
          if (this.searchField[i].FieldName === "Customer ID") {
            this.valueName = "Customer ID"
          }
          if (this.searchField[i].FieldName === "Customer Name") {
            this.valueName = "Customer Name"
          }
        } else if (this.searchField[i].FieldType === "DropDown") {
          this.dropDownValue = []
          this.valueType = "DropDown"
          if (this.searchField[i].Productcode === 'DFX') {
            if (this.searchField[i].FieldName === 'TxnSubTypeName') {
              // this is transaction subtype
              //NameToDisplay
              let name = this.searchField[i].NameToDisplay.replace(/\s/g, "");
              this.dropDownFieldName = this.searchField[i].FieldTypeColumnName
              this.commonEnquiryService.getDropDownData(name).subscribe(data => {
                this.dropDownData = data['result']
                for (let j in this.dropDownData) {
                  this.dropDownValue.push(this.dropDownData[j])
                }
                this.value = this.dropDownValue[0]
              })
            } else if (this.searchField[i].FieldName === 'TransactionStatus') {
              // this is transaction status
              let name = this.searchField[i].NameToDisplay.replace(/\s/g, "");
              this.commonEnquiryService.getDropDownData(name).subscribe(data => {
                for (let k in data['result']) {
                  this.dropDownValue.push(data['result'][k])
                }
                this.value = this.dropDownValue[0]
              })
            }
            else if (this.searchField[i].FieldName === 'Fox_Transaction_Status') {
              // this is fox status
              let name = this.searchField[i].NameToDisplay.replace(/\s/g, "");
              this.commonEnquiryService.getDropDownData(name).subscribe(data => {
                for (let k in data['result']) {
                  this.dropDownValue.push(data['result'][k])
                }
                this.value = this.dropDownValue[0]
              })
            }
          }
          else if (this.searchField[i].Productcode === 'VS') {
            if (this.searchField[i].FieldName === 'TransactionType') {
              this.dropDownFieldName = this.searchField[i].FieldTypeColumnName
              this.commonEnquiryService.getDropDownDataTransactionType(this.userIndex, this.branchCode, this.productCode).subscribe(data => {
                this.dropDownData = data['result']
                for (let j in this.dropDownData) {
                  this.dropDownValue.push(this.dropDownData[j][this.searchField[i].FieldTypeColumnName])
                }
                this.value = this.dropDownValue[0]
              })
            } else if (this.searchField[i].FieldName === 'TransactionStatus') {
              this.commonEnquiryService.getDropDownCaseStatus(this.branchCode, this.productCode).subscribe(data => {
                console.log('dropDown case status', data)
                for (let k in data['result']) {
                  this.dropDownValue.push(data['result'][k].Status)
                }
                this.dropDownValue.push('New')
                this.value = this.dropDownValue[0]
              })
            }
          }
          else {
            this.tableService.getDropDownData(this.searchField[i].FieldTypeTableName, this.searchField[i].FieldTypeColumnName).subscribe(data => {
              this.dropDownData = data['result']
              this.dropDown[this.searchField[i].FieldName] = this.dropDownData
              for (let j in this.dropDownData) {
                this.dropDownValue.push(this.dropDownData[j][this.searchField[i].FieldTypeColumnName])
              }
              this.value = this.dropDownValue[0]
            })
          }
        }
      }
    }
  }

  setModalDropDownType(field: any) {
    this.alertFlag = false
    this.modalValue = ""
    this.dropDownData = []
    this.dropDownValue = []

    for (let i in this.searchField) {
      if (this.searchField[i].NameToDisplay === this.modalField) {

        if (this.searchField[i].FieldType === "Text") {
          this.modalValueType = "Text"
        } else if (this.searchField[i].FieldType == "Date") {
          this.modalValueType = "Date"
          this.modalValue = undefined
        } else if (this.searchField[i].FieldType == "Auto") {
          this.modalValueType = "Auto"
          if (this.searchField[i].FieldName === "Customer ID") {
            this.modalValueName = "Customer ID"
          }
          if (this.searchField[i].FieldName === "Customer Name") {
            this.modalValueName = "Customer Name"
          }
        } else if (this.searchField[i].FieldType === "Multi") {
          this.modalValueType = "Multi"
          if (this.searchField[i].FieldType === 'Multi') {

            this.tableService.getDropDownData(this.searchField[i].FieldTypeTableName, this.searchField[i].FieldTypeColumnName).subscribe(data => {

              this.dropDownData = data['result']
              this.multiSelectDropdown = []
              for (let k in this.dropDownData) {

                this.multiSelectDropdown.push(this.dropDownData[k][this.searchField[i].FieldTypeColumnName])
              }
              this.multiSelect[this.searchField[i].FieldName] = this.multiSelectDropdown

            })
          }

        } else if (this.searchField[i].FieldType === "DropDown") {
          this.dropDownValue = []
          this.modalValueType = "DropDown"
          if (this.searchField[i].Productcode === 'DFX') {
            if (this.searchField[i].FieldName === 'TxnSubTypeName') {
              // this is transaction subtype
              //NameToDisplay
              let name = this.searchField[i].NameToDisplay.replace(/\s/g, "");
              this.dropDownFieldName = this.searchField[i].FieldTypeColumnName
              this.commonEnquiryService.getDropDownData(name).subscribe(data => {
                this.dropDownData = data['result']
                for (let j in this.dropDownData) {
                  this.dropDownValue.push(this.dropDownData[j])
                }
                this.modalValue = this.dropDownValue[0]
              })
            } else if (this.searchField[i].FieldName === 'TransactionStatus') {
              // this is transaction status
              let name = this.searchField[i].NameToDisplay.replace(/\s/g, "");
              this.commonEnquiryService.getDropDownData(name).subscribe(data => {
                for (let k in data['result']) {
                  this.dropDownValue.push(data['result'][k])
                }
                this.modalValue = this.dropDownValue[0]
              })
            }
            else if (this.searchField[i].FieldName === 'Fox_Transaction_Status') {
              // this is fox status
              let name = this.searchField[i].NameToDisplay.replace(/\s/g, "");
              this.commonEnquiryService.getDropDownData(name).subscribe(data => {
                for (let k in data['result']) {
                  this.dropDownValue.push(data['result'][k])
                }
                this.modalValue = this.dropDownValue[0]
              })
            }
          }
          else if (this.searchField[i].Productcode === 'VS') {
            if (this.searchField[i].FieldName === 'TransactionType') {
              this.dropDownFieldName = this.searchField[i].FieldTypeColumnName
              this.commonEnquiryService.getDropDownDataTransactionType(this.userIndex, this.branchCode, this.productCode).subscribe(data => {
                this.dropDownData = data['result']
                for (let j in this.dropDownData) {
                  this.dropDownValue.push(this.dropDownData[j][this.searchField[i].FieldTypeColumnName])
                }
                this.modalValue = this.dropDownValue[0]
              })
            } else if (this.searchField[i].FieldName === 'TransactionStatus') {
              this.commonEnquiryService.getDropDownCaseStatus(this.branchCode, this.productCode).subscribe(data => {
                console.log('dropDown case status', data)
                for (let k in data['result']) {
                  this.dropDownValue.push(data['result'][k].Status)
                }
                this.dropDownValue.push('New')
                this.modalValue = this.dropDownValue[0]
              })
            }
          }
          else {
            this.tableService.getDropDownData(this.searchField[i].FieldTypeTableName, this.searchField[i].FieldTypeColumnName).subscribe(data => {
              this.dropDownData = data['result']
              this.dropDown[this.searchField[i].FieldName] = this.dropDownData
              for (let j in this.dropDownData) {
                this.dropDownValue.push(this.dropDownData[j][this.searchField[i].FieldTypeColumnName])
              }
              this.modalValue = this.dropDownValue[0]
            })
          }
        }
      }
    }
  }

  exampleSetFilter(modalValue, modalField) {
    console.log('length of fiter', this.modalBodyFilterValues.length)
    if (this.modalBodyFilterValues.length < AppConfigServiceService.settings.AdvancedFilter.max) {
      this.maxFilterFlag = false
      this.combinationAlertFlag = false
      this.alertFlag = false


      if (this.modalValue !== "" && this.modalValue !== undefined && this.modalValue !== 'Select') {
        this.clearFlag = true
        var length = 0
        var tempCount = 0
        this.exampleModalValue = []

        for (let i in this.searchField) {
          if (this.searchField[i].NameToDisplay === this.modalField) {
            if (this.searchField[i].FieldType !== 'Date') {
              this.exampleModalValue = []
              length = 0
              if (this.searchField[i].NameToDisplay === modalField) {
                for (let m in this.obj[this.searchField[i].FieldName]) {
                  length = length + 1
                }

                if (length === 0) {
                  this.exampleModalValue = []
                  this.examplearaay = []
                  this.examplearaay.push(modalValue.trim())
                  this.exampleModalValue.push(modalValue.trim())
                  this.modalBodyFilterValues.push(this.modalField + " " + "Equals" + " " + this.modalValue)
                } else {
                  for (let k in this.obj[this.searchField[i].FieldName]) {
                    if (this.obj[this.searchField[i].FieldName][k] === modalValue) {
                      tempCount = tempCount + 1
                      document.getElementById("simpleNotification").style.zIndex = "1151";
                      this.combinationAlertFlag = true
                      this.exampleModalValue = []
                      this.examplearaay = []
                      for (let l in this.obj[this.searchField[i].FieldName]) {
                        this.exampleModalValue.push(this.obj[this.searchField[i].FieldName][l])
                      }
                    } else {
                      this.exampleModalValue = []
                      this.examplearaay = []
                      for (let m in this.obj[this.searchField[i].FieldName]) {
                        this.exampleModalValue.push(this.obj[this.searchField[i].FieldName][m])
                      }
                      this.exampleModalValue.push(modalValue)
                    }
                  }
                }
                this.obj[this.searchField[i].FieldName] = this.exampleModalValue
              }
            } else if (this.searchField[i].FieldType === 'Date') {
              if (this.dateStr !== "" && this.dateStr !== undefined) {
                if (this.modalBodyFilterValues.length !== 0) {
                  for (let filterValues in this.modalBodyFilterValues) {
                    if (this.modalBodyFilterValues[filterValues].indexOf(this.searchField[i].NameToDisplay) !== -1) {
                      this.modalBodyFilterValues.splice(filterValues, 1);
                    }
                  }
                  this.modalBodyFilterValues.push(this.dateStr)
                  this.dateStr = ""
                } else {
                  this.modalBodyFilterValues.push(this.dateStr)
                  this.dateStr = ""
                }
              }
            }
          }
        }

        if (tempCount !== 1 && length !== 0) {
          this.modalBodyFilterValues.push(this.modalField + " " + "Equals" + " " + this.modalValue)
        }
      } else {
        this.alertFlag = true
      }
    } else {
      this.maxFilterFlag = false
      this.maxFilterFlag = true
      console.log('only limited')
    }
  }


  setFilterForSearch() {

    if (this.value !== "" && this.value !== undefined) {
      this.clearFlag = true
      var count = 0
      for (let i in this.modalBodyFilterValues) {
        count = count + 1
        var substr = this.field
        var str = this.modalBodyFilterValues[i]

        if (str.indexOf(substr) !== -1 && str.indexOf('Date') === -1) {
          this.modalBodyFilterValues[i] = this.field + " " + "Equals" + " " + this.value
        } else if (str.indexOf('Date') === -1) {
          this.modalBodyFilterValues = []
          this.modalBodyFilterValues.push(this.field + " " + "Equals" + " " + this.value)
        } else if (str.indexOf('Date') !== -1) {
          this.modalBodyFilterValues = []
          this.modalBodyFilterValues.push(this.dateStr)
        }
      }

      if (count === 0) {
        if (this.field.indexOf('Date') !== -1) {
          this.modalBodyFilterValues = []
          this.modalBodyFilterValues.push(this.dateStr)
          console.log('3')
        } else {
          this.modalBodyFilterValues = []
          this.modalBodyFilterValues.push(this.field + " " + "Equals" + " " + this.value)
        }
      }
    } else {
      this.notif.warn(
        'Info',
        AppConfigServiceService.settings.WarningMessages.EnterSearchValue,
        {
          timeOut: 10000,
          showProgressBar: false,
          pauseOnHover: true,
          clickToClose: true,
          maxLength: 100
        }
      )
    }
  }

  setModalSearch() {
    this.alertFlag = false
    this.combinationAlertFlag = false

    if (this.modalBodyFilterValues.length !== 0) {
      this.searchFlag = false
    } else {
      this.clearFlag = false
      this.searchFlag = true
    }

    this.tableDetails.count = 0
    this.tableDetails.pageNo = 0
    this.loadDetails(false)
    this.config.currentPage = 1
  }

  onDeselect(value: any) {
    if (value.length === 0) {
      this.value = ""
      this.obj = {}
      this.loadDetails(false)
      this.modalBodyFilterValues = []
      this.clearFlag = false
    } else {
      this.modalBodyFilterValues = []
      this.modalBodyFilterValues.push(this.field + " " + "Equals" + " " + value)
      this.value = value
    }
  }

  deleteModalValue(items, index) {
    this.examplearaay = []

    for (let i in this.searchField) {
      if (items.indexOf(this.searchField[i].NameToDisplay) !== -1) {
        for (let k in this.obj) {
          if (k === this.searchField[i].FieldName) {
            for (let item in this.obj[k]) {
              var str = this.searchField[i].NameToDisplay + " " + "Equals" + " " + this.obj[k][item]
              var str1 = (items).toString()

              if (this.searchField[i].FieldType !== 'Date') {
                if (str !== str1) {
                  this.examplearaay.push(this.obj[k][item])
                }
              } else if (this.searchField[i].FieldType === 'Date') {
                delete this.obj[this.searchField[i].FieldName]
              }
            }
          }
        }

        if (this.examplearaay.length !== 0) {
          delete this.obj[this.searchField[i].FieldName]
          this.obj[this.searchField[i].FieldName] = this.examplearaay
        } else {
          delete this.obj[this.searchField[i].FieldName]
        }

        this.modalBodyFilterValues.splice(index, 1);
      }

      if (this.modalBodyFilterValues.length === 0) {
        delete this.obj[this.searchField[i].FieldName]
        this.clearFlag = false
        this.searchFlag = true
        this.combinationAlertFlag = false
        this.onReset()
      }
    }
  }

  example() {
    if (this.modalValueType === 'DropDown') {
      this.modalValue = 'Select'
    } else {
      this.modalValue = ""
    }
  }

  alertClose() {
    this.alertFlag = false
  }

  maxFilteralertClose() {
    this.maxFilterFlag = false
  }

  pageClick(event) {

  }

  deleteFromWatchList() {
    if (this.transactionRefNo !== '' && this.transactionRefNo !== undefined) {
      this.tableService.unWatchList(this.transactionRefNo, this.userIndex).subscribe(data => {
        this.transactionRefNo = ''

        this.notif.success(
          'Success',
          AppConfigServiceService.settings.WarningMessages.DeleteFromWatch,
          {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          }
        )

        this.loadDetails(false)
      })
    } else {
      this.notif.warn(
        'Info',
        AppConfigServiceService.settings.WarningMessages.SelectTransaction,
        {
          timeOut: 5000,
          showProgressBar: false,
          pauseOnHover: true,
          clickToClose: true,
          maxLength: 100
        }
      )
    }
  }

  sessionValidation() {
    this.tableService.sessionValidation()
  }

  relatedT24NoSelect(inst) {
    this.tableService.getTransactionId(inst.RelatedT24RefNo, this.branchCode, this.productCode).subscribe(data => {
      this.itemSelected.emit(data['result'][0])
    })
  }

  clearSearchField() {
    console.log('** WATCHLIST before inside clear search field: ', this.value, " this.obj: ", this.obj)
    if (this.value !== "" && this.value !== undefined
      && JSON.stringify(this.value) !== '{"startDate":null,"endDate":null}'
      && JSON.stringify(this.obj) !== '{}') {
      this.onReset()
    } else if (this.modalBodyFilterValues.length !== 0 && this.modalBodyFilterValues !== undefined && JSON.stringify(this.obj) !== '{}') {
      this.onReset()
    }
    console.log('*** WATCHLIST after inside clear search field: ', this.value)
  }
}
