import {Component, OnInit, Output, EventEmitter, ComponentFactoryResolver} from '@angular/core';
import {CommonEnquiryService} from 'src/app/services/common-enquiry.service';
import {TableService} from 'src/app/services/table.service';
import {FormControl} from '@angular/forms';
import {WorkItemService} from 'src/app/services/work-item.service';
import {NotificationsService} from 'angular2-notifications';
import {AppConfigServiceService} from 'src/app/services/app-config-service.service';
import {Angular5Csv} from 'angular5-csv/dist/Angular5-csv';
import {InputService} from 'src/app/services/input.service';
import {DatePipe} from '@angular/common'

export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {
  relT24: any
  options: any = {
    title: 'Enquiry Report',
    headers: ["First Name", "Last Name", "ID"],
    nullToEmptyString: true,
  };
  header: any = []
  exportSingleData: any = []
  exportData: any = []
  examplearaay: any = []
  exampleobjJSON = {}
  temp: string = ''
  exampleModalValue: any = []
  searchFlag: boolean = true
  modalFlag: boolean = true
  clearFlag: boolean = false
  alertFlag: boolean = false
  maxFilterFlag: boolean = false
  combinationAlertFlag: boolean = false
  dateStr: string
  createFlag: boolean = false
  userRoleDetails: any = []
  @Output() itemSelected = new EventEmitter<any>();
  @Output() createTransaction = new EventEmitter<any>();
  tempVar: string
  userIndex: number = JSON.parse(sessionStorage.getItem("currentUser")).userIndex
  userName = JSON.parse(sessionStorage.getItem("currentUser")).userName
  roleName: string;
  checkboxCheck = false;
  showButton = false;
  branchCode: string = ''
  productCode: string = ''
  branch: any = "Select"
  product: any = "Select"
  dropDownData: any
  tableFlag: boolean = false
  resultFlag: boolean = false
  tableField: any = []
  multiSelectDropdown = []
  dropDown = {}
  obj = {};
  multiSelect = {}
  tempMap = new Map();
  searchField: any = []
  transactionRefNo: any
  opens: string;
  drops: string;
  selected: any;
  tableDetails = {
    "userIndex": this.userIndex,
    "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
    "pageNo": 0,
    "count": 0,
    "orderBy": AppConfigServiceService.settings.Pagination.orderBy,
    "sortBy": 'DESC'
  }
  collection = {count: 0, data: null};
  config: any;
  dropdownSettings = {}
  message: any;
  modalBodyFilterValues: any = []
  modalBodyFilter: any = []
  modalValue: any = ""
  value: any
  valueType: any
  modalField: any = "Select"
  field: any = "Select"
  dynamicID: any = []
  myTodoDataMap = new Map();
  myTodoData: any = []
  valueName: any
  dropDownValue: any = []
  dropDownFieldName: string
  modalValueType: any
  modalValueName: any
  public loading: boolean = false;

  constructor(private datePipe: DatePipe, private inputService: InputService, private notif: NotificationsService, private workItemService: WorkItemService, private commonEnquiryService: CommonEnquiryService, private tableService: TableService) {
    this.opens = 'right';
    this.drops = 'down';
  }

  async ngOnInit() {
    this.loading = true
    this.config = {
      id: 'EnquiryID',
      itemsPerPage: AppConfigServiceService.settings.Pagination.itemsPerPage,
      currentPage: 1,
      totalItems: 0
    };

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
      this.getCommonEnquiryField(this.branchCode, this.productCode)
      this.loadDetails(true)
    } else {
      this.commonEnquiryService.getBranch(this.userIndex).subscribe(data => {
        console.log('inside enquiry oninit')
        this.branchCode = data['result'][0].BranchCode
        this.commonEnquiryService.getProduct(this.userIndex, data['result'][0].BranchName).subscribe(productData => {
          this.productCode = productData['result'][0].productCode

          this.getCommonEnquiryField(this.branchCode, this.productCode)
          this.loadDetails(true)
        })
      })
    }
    this.getData()

  }

  getData() {
    this.inputService.getMessage().subscribe(message => {
      console.log('inside enquiry message', message)
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
      "userIndex": this.userIndex,
      "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
      "pageNo": 0,
      "count": 0,
      "orderBy": this.getOrderByState(this.productCode),
      "sortBy": 'DESC'
    }
    this.onReset()
  }

  onReset() {
    this.showButton = false
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
    this.config = {
      id: 'EnquiryID',
      itemsPerPage: AppConfigServiceService.settings.Pagination.itemsPerPage,
      currentPage: 1,
      totalItems: 0
    };
    this.tableDetails = {
      "userIndex": this.userIndex,
      "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
      "pageNo": 0,
      "count": 0,
      "orderBy": this.getOrderByState(this.productCode),
      "sortBy": 'DESC'
    }
    for (let i in this.tempMap) {
      this.tempMap[i] = " "
    }
    this.getCommonEnquiryField(this.branchCode, this.productCode)
    this.loading = true
    this.loadDetails(false)
  }

  getCommonEnquiryField(branchCode, productCode) {
    this.tableService.getUserRoleDetails(this.userIndex).subscribe(data => {
      if (data['result'] !== '' && data['result'] !== undefined) {
        this.userRoleDetails = data['result']
        console.log(this.userRoleDetails[0].UserCategoryName)
        console.log(this.productCode)
        if (this.userRoleDetails[0].UserCategoryName === 'SSC' && this.branchCode === 'SNG' && this.productCode.toLowerCase() === 'dp') {
          this.createFlag = false
        } else if (this.userRoleDetails[0].UserCategoryName === 'SSC' && this.branchCode === 'BKK') {
          this.createFlag = false
        } else if (this.productCode === 'DFX') {
          this.createFlag = false
        } else {
          this.createFlag = true
        }
      }
    })
    this.searchField = []

    this.tableService.getEnquiryTableFields(branchCode, productCode, this.userIndex).subscribe(data => {
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
      this.showButton = false
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

  checkboxClick() {
    this.checkboxCheck = false;
    for (let i in this.dynamicID) {
      let selectItmChkBxId = this.dynamicID[i]
      let checkbox = document.getElementById(selectItmChkBxId) as HTMLInputElement;
      if (checkbox && checkbox.checked) {
        this.checkboxCheck = true
        break
      }
    }
    if (!this.checkboxCheck) {
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
      );
      // this.refresh();
    }

  }

  //This function is used for moving the checked transaction from enquiry to dashboard on click of CallBackAmendmend Button
  callBackAmendment() {
    if (this.tableService.sessionValidationCallback()) {
      for (let i in this.dynamicID) {
        let tempVar2 = this.dynamicID[i]
        if ((document.getElementById(tempVar2) as HTMLInputElement).checked) {
          let checkBoxChecked = this.myTodoDataMap[i];
          let processID = checkBoxChecked.ProcessInstanceID
          this.tableService.callbackAmendment(processID, this.userName).subscribe(
            (data) => {
              processID = '';
              this.showButton = false
              this.checkboxCheck = false
              this.notif.success(
                'Success',
                data[0]['result'],
                {
                  timeOut: 5000,
                  showProgressBar: false,
                  pauseOnHover: true,
                  clickToClose: true,
                  maxLength: 100
                }
              );
              this.refresh();
            },
            (error) => {
              this.showButton = false
              this.checkboxCheck = false
              this.notif.error(
                'Error',
                error.error.result,
                {
                  timeOut: 5000,
                  showProgressBar: false,
                  pauseOnHover: true,
                  clickToClose: true,
                  maxLength: 100
                }
              );
              this.refresh();
            }
          );
          break
        }
      }
    }
  }

//This function is used for moving the checked transaction from enquiry to dashboard on click of utilizationReversal Button
  utilizationReversal() {
    if (this.tableService.sessionValidationCallback()) {
      for (let i in this.dynamicID) {
        let tempVar2 = this.dynamicID[i]
        if ((document.getElementById(tempVar2) as HTMLInputElement).checked) {
          let checkboxchecked = this.myTodoDataMap[i];
          let processID = checkboxchecked.ProcessInstanceID
          this.tableService.utilizationReversal(processID, this.userName).subscribe(
            (data) => {
              processID = '';
              this.showButton = false
              this.checkboxCheck = false
              this.notif.success(
                'Success',
                data[0]['result'],
                {
                  timeOut: 5000,
                  showProgressBar: false,
                  pauseOnHover: true,
                  clickToClose: true,
                  maxLength: 100
                }
              );
              this.refresh();
            },
            (error) => {
              this.showButton = false
              this.checkboxCheck = false
              this.notif.error(
                'Error',
                error.error.result,
                {
                  timeOut: 5000,
                  showProgressBar: false,
                  pauseOnHover: true,
                  clickToClose: true,
                  maxLength: 100
                }
              );
              this.refresh();
            }
          );
          break
        }
      }
    }
  }

  relatedT24NoSelect(inst) {
    this.tableService.getTransactionId(inst.RelatedT24RefNo, this.branchCode, this.productCode).subscribe(data => {
      this.itemSelected.emit(data['result'][0])
    })
  }

  addToWatchList() {
    if (this.transactionRefNo !== '' && this.transactionRefNo !== undefined) {
      this.tableService.addToWatchList(this.transactionRefNo, this.userIndex).subscribe(data => {
        this.transactionRefNo = ''
        this.notif.success(
          'Success',
          data[0]['result'],
          {
            timeOut: 5000,
            showProgressBar: false,
            pauseOnHover: true,
            clickToClose: true,
            maxLength: 100
          }
        )
        this.refresh()
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

  getOrderByState(productCode) {
    return (("DFX" === productCode) ? AppConfigServiceService.settings.Pagination.orderByDFX : AppConfigServiceService.settings.Pagination.orderBy)
  }

  loadDetails(state) {
    this.loading = true;
    this.dynamicID = []
    this.obj['branchCode'] = this.branchCode
    this.obj['productCode'] = this.productCode
    this.tableDetails['branchCode'] = this.branchCode
    this.tableDetails['productCode'] = this.productCode

    if (state === true) {
      this.tableDetails['orderBy'] = this.getOrderByState(this.productCode)
    }

    this.obj["tableDetails"] = this.tableDetails
    console.log('load details ', this.obj)
    this.tableService.getEnquiryColumnTableFields(this.branchCode, this.productCode, this.userIndex).subscribe(data => {
      this.tableField = data[0]['result']
    })
    this.getEnquiryDetails();
  }


  private getEnquiryDetails() {
    this.commonEnquiryService.getEnquiryDetails(this.obj).subscribe(data => {
      this.myTodoData = data[0]['result']['commonEnquiryDetails']
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
    }, (error) => {
      this.loading = false
    })
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

  getRandom(): number {
    return (Math.random())
  }


  export() {
    this.loading = true
    this.tableService.getEnquiryColumnTableFields(this.branchCode, this.productCode, this.userIndex).subscribe(coldata => {
      this.header = []
      for (let i in coldata[0]['result']) {
        console.log('header', coldata[0]['result'])
        console.log('header', coldata[0]['result'][i])
        console.log('export header', coldata[0]['result'][i].NameToDisplay)
        this.header.push(coldata[0]['result'][i].NameToDisplay)
      }
      console.log('header ', this.header)
      this.options.headers = this.header

      this.commonEnquiryService.getEnquiryDetails(this.obj).subscribe(data => {
        this.exportData = []
        console.log('enquiry Details', data)
        for (let i in data[0]['result']['commonEnquiryDetails']) {
          this.exportSingleData = []
          for (let j in coldata[0]['result']) {
            console.log('inside for', data[0]['result']['commonEnquiryDetails'][i][coldata[0]['result'][j].FieldNameAlias])
            if (data[0]['result']['commonEnquiryDetails'][i][coldata[0]['result'][j].FieldNameAlias] !== undefined) {
              console.log('inside if', data[0]['result']['commonEnquiryDetails'][i][coldata[0]['result'][j].FieldNameAlias])
              this.temp = coldata[0]['result'][j].FieldNameAlias
              this.temp = this.temp.toLowerCase()
              if (this.temp.indexOf('date') !== -1) {
                console.log('date', coldata[0]['result'][j].FieldNameAlias)
                console.log('date', new Date(data[0]['result']['commonEnquiryDetails'][i][coldata[0]['result'][j].FieldNameAlias]).toDateString())
                console.log('date', this.datePipe.transform(data[0]['result']['commonEnquiryDetails'][i][coldata[0]['result'][j].FieldNameAlias], 'dd-MMM-y'))
                this.exportSingleData.push(this.datePipe.transform(data[0]['result']['commonEnquiryDetails'][i][coldata[0]['result'][j].FieldNameAlias], 'dd-MMM-y'))
              } else {
                this.exportSingleData.push(data[0]['result']['commonEnquiryDetails'][i][coldata[0]['result'][j].FieldNameAlias])
              }

            } else {
              this.exportSingleData.push('null')
            }
          }
          this.exportData.push(this.exportSingleData)
        }
        console.log('export data', this.exportData)
        this.loading = false
        var p = new Angular5Csv(this.exportData, 'Enquiry-Report', this.options);
        console.log('export object', p)
        this.tableDetails.pageSize = AppConfigServiceService.settings.Pagination.itemsPerPage
      })
    })
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
    this.getEnquiryDetails()
  }

  setSearch() {
    if (this.branchCode !== "" && this.productCode !== "") {
      if (this.value !== "" && this.value !== undefined) {
        this.modalFlag = false
        for (let i in this.searchField) {
          if (this.searchField[i].NameToDisplay === this.field && this.searchField[i].FieldType !== "Date") {
            console.log(this.searchField[i].NameToDisplay)
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
      "userIndex": this.userIndex,
      "pageSize": AppConfigServiceService.settings.Pagination.itemsPerPage,
      "pageNo": 0,
      "count": 0,
      "orderBy": this.getOrderByState(this.productCode),
      "sortBy": 'DESC'
    }
    this.dropDownData = []
    for (let i in this.searchField) {
      if (this.searchField[i].NameToDisplay === this.field) {
        if (this.searchField[i].FieldType === "Text") {
          this.valueType = "Text"
        } else if (this.searchField[i].FieldType === "Date") {
          this.valueType = "Date"
          this.value = undefined
        } else if (this.searchField[i].FieldType === "Auto") {
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
          if (this.searchField[i].ProductCode === 'DFX') {
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
          else if (this.searchField[i].ProductCode === 'VS') {
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
        } else if (this.searchField[i].FieldType === "Date") {
          this.modalValueType = "Date"
          this.modalValue = undefined
        } else if (this.searchField[i].FieldType === "Auto") {
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
          if (this.searchField[i].ProductCode === 'DFX') {
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
          else if (this.searchField[i].ProductCode === 'VS') {
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
      this.showButton = false
      this.clearFlag = true
      var count = 0
      for (let i in this.modalBodyFilterValues) {
        console.log('inside somethig', this.modalBodyFilterValues[i])
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
        } else {
          this.modalBodyFilterValues = []
          this.modalBodyFilterValues.push(this.field + " " + "Equals" + " " + this.value)
        }
      }
    } else {
      this.showButton = true
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
    this.showButton = false
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

  callBackButtonVisiblityCheck() {
    this.showButton = false
  }

  alertClose() {
    this.alertFlag = false
  }

  maxFilteralertClose() {
    this.maxFilterFlag = false
  }

  pageClick(event) {
  }

  sessionValidation() {
    this.tableService.sessionValidation()
  }

  clearSearchField() {
    console.log('**Inside Enquiry before clear search field: ', this.value, " this.obj: ", this.obj)

    if (this.value !== "" && this.value !== undefined
      && JSON.stringify(this.value) !== '{"startDate":null,"endDate":null}'
      && JSON.stringify(this.obj) !== '{}') {
      this.onReset()

    } else if (this.modalBodyFilterValues.length !== 0 && this.modalBodyFilterValues !== undefined
      && JSON.stringify(this.obj) !== '{}') {
      this.onReset()
    }
    console.log('*** Inside Enquiry after clear search field: ', this.value)
  }
}
