import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {InputService} from 'src/app/services/input.service';

@Component({
  selector: 'app-report-edit',
  templateUrl: './report-edit.component.html',
  styleUrls: ['./report-edit.component.scss']
})
export class ReportEditComponent implements OnInit {
  @Input() instruction;
  url: any
  report_src: SafeResourceUrl;
  reportUrl: any;
  id: any;
  ip: any
  port: any
  protocol: any
  branchCode: string = ''
  productCode: string = ''

  constructor(private sanitizer: DomSanitizer, private routid: ActivatedRoute) {

  }

  ngOnInit() {
    this.branchCode = InputService.input.branchName
    this.productCode = InputService.input.prodctName
    this.routid.params.subscribe(params => {

      this.id = this.instruction.reportId
      this.ip = window.location.hostname
      this.port = window.location.port
      this.protocol = window.location.protocol

      if (this.port !== '' && this.port !== undefined) {
        this.url = "../../bam/login/ExtendSession.jsf?CalledFrom=EXT&Branch=" + this.branchCode + "&Business Category=" + this.productCode + "&UserId=" + JSON.parse(sessionStorage.getItem("currentUser")).userName + "&UserIndex=" + JSON.parse(sessionStorage.getItem("currentUser")).userIndex + "&SessionId=" + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + "&CabinetName=" + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + "&LaunchClient=RI&ReportIndex=" + this.id + "&OAPDomHost=" + this.ip + ":" + this.port + "&OAPDomPrt=" + this.protocol + "&AjaxRequest=Y&PersonalName=" + JSON.parse(sessionStorage.getItem("currentUser")).userName;
      } else {
        this.url = "../../bam/login/ExtendSession.jsf?CalledFrom=EXT&Branch=" + this.branchCode + "&Business Category=" + this.productCode + "&UserId=" + JSON.parse(sessionStorage.getItem("currentUser")).userName + "&UserIndex=" + JSON.parse(sessionStorage.getItem("currentUser")).userIndex + "&SessionId=" + JSON.parse(sessionStorage.getItem("currentUser")).sessionID + "&CabinetName=" + JSON.parse(sessionStorage.getItem("currentUser")).cabinetName + "&LaunchClient=RI&ReportIndex=" + this.id + "&OAPDomHost=" + this.ip + "&OAPDomPrt=" + this.protocol + "&AjaxRequest=Y&PersonalName=" + JSON.parse(sessionStorage.getItem("currentUser")).userName;
      }

      this.report_src = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
      this.reportUrl = this.report_src;
    });
  }
}
