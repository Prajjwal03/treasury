import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

import {ReportServiceService} from 'src/app/services/report-service.service';
import {ActivatedRoute} from '@angular/router';
import {InputService} from 'src/app/services/input.service';
import {CommonEnquiryService} from 'src/app/services/common-enquiry.service';

@Component({
  selector: 'app-report-regeration',
  templateUrl: './report-regeration.component.html',
  styleUrls: ['./report-regeration.component.scss']
})
export class ReportRegerationComponent implements OnInit {

  sortBy: string = 'DESC'
  @Output() createTabReport = new EventEmitter<any>();
  value: string = ''
  tempArray: any = []
  url: any
  branchCode: string = ''
  productCode: string = ''
  id: any;
  message: any;
  ReportNameArray: any = [];
  tableFlag: boolean = false
  resultFlag: boolean = false
  reportName: any = []

  constructor(private inputService: InputService,
              private commonEnquiryService: CommonEnquiryService,
              private sanitizer: DomSanitizer,
              private reportids: ReportServiceService,
              private routid: ActivatedRoute) {
  }

  ngOnInit() {
    if (InputService.input !== undefined) {
      this.branchCode = InputService.input.branchCode
      this.productCode = InputService.input.productCode
      this.loadDetails()
    } else {
      this.commonEnquiryService.getBranch(JSON.parse(sessionStorage.getItem("currentUser")).userIndex).subscribe(data => {
        console.log('inside enquiry oninit')
        this.branchCode = data['result'][0].BranchCode
        this.commonEnquiryService.getProduct(JSON.parse(sessionStorage.getItem("currentUser")).userIndex, data['result'][0].BranchName).subscribe(productData => {
          this.productCode = productData['result'][0].productCode
          this.loadDetails()
        })
      })
    }
    this.getData()

  }

  getData() {
    this.inputService.getMessage().subscribe(message => {

      this.message = message
      this.branchCode = this.message.text.branchCode
      this.productCode = this.message.text.productCode
      this.value = ''
      this.loadDetails()
    });

  }

  loadDetails() {
    this.reportids.getReportID(JSON.parse(sessionStorage.getItem("currentUser")).userIndex, this.branchCode, this.productCode).subscribe(data => {
      this.reportName = []
      this.ReportNameArray = []
      if (data['result'] !== 'No Record Found') {
        this.ReportNameArray = data;
        this.ReportNameArray = this.ReportNameArray['result']
        this.tempArray = this.ReportNameArray
        if (this.ReportNameArray.length === 0) {
          this.resultFlag = true
          this.tableFlag = false
        } else {
          this.tableFlag = true
          this.resultFlag = false
          for (let i in this.ReportNameArray) {
            this.reportName.push(this.ReportNameArray[i].reportName)
          }
        }
      }
    });
  }

  search() {
    console.log('search Value', this.value)
    this.tempArray = this.ReportNameArray
    this.ReportNameArray = []
    let tempValue = this.value
    tempValue = tempValue.trim().toLowerCase()

    for (let i in this.tempArray) {
      console.log(this.tempArray[i])
      console.log(this.tempArray[i].reportName.toLowerCase().includes(tempValue))
      if (this.tempArray[i].reportName.toLowerCase().includes(tempValue)) {
        this.ReportNameArray.push(this.tempArray[i])
      }
    }

    if (this.ReportNameArray.length === 0) {
      this.resultFlag = true
      this.tableFlag = false
    } else {
      this.tableFlag = true
      this.resultFlag = false
    }
    console.log('final array', this.ReportNameArray)
  }

  sort() {
    if (this.sortBy === 'DESC') {
      this.sortBy = 'ASC'
      const ascending: any = this.reportName.sort((a, b) => (a > b ? 1 : -1));
      console.log('ascending', ascending)
      this.ReportNameArray = []
      for (let i in ascending) {
        for (let j in this.tempArray) {
          if (ascending[i] === this.tempArray[j].reportName) {
            this.ReportNameArray.push(this.tempArray[j])
          }
        }
      }
    } else if (this.sortBy === 'ASC') {
      this.sortBy = 'DESC'
      const descending: any = this.reportName.sort((a, b) => (a > b ? -1 : 1));
      console.log('ascending', descending)
      this.ReportNameArray = []
      for (let i in descending) {
        for (let j in this.tempArray) {
          if (descending[i] === this.tempArray[j].reportName) {
            this.ReportNameArray.push(this.tempArray[j])
          }
        }
      }
    }
  }

  sessionValidation() {

  }

  onReset() {
    this.sortBy = 'DESC'
    this.value = ''

    this.loadDetails()
  }
}
