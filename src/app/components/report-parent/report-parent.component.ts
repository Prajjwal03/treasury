import {TabsComponent} from 'src/app/tabs/tabs/tabs.component';
import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-report-parent',
  templateUrl: './report-parent.component.html',
  styleUrls: ['./report-parent.component.scss']
})
export class ReportParentComponent implements OnInit {
  userName = JSON.parse(sessionStorage.getItem("currentUser")).userName;
  userDBId = JSON.parse(sessionStorage.getItem("currentUser")).sessionID;
  @ViewChild('instructionReport', {static: false}) editInsTemplate;
  @ViewChild(TabsComponent, {static: false}) TabsComponent
  newInstruction = {}
  inst = {
    reportId: "",
    reportName: ""
  }

  constructor() {
  }

  ngOnInit() {
  }

  async createTabReport(instruction) {
    this.inst.reportId = instruction.reportId
    this.inst.reportName = instruction.reportName
    instruction.transactionID = 'Report'
    this.TabsComponent.openTab(
      `${this.inst['reportName']}`,
      this.editInsTemplate,
      instruction,
      true
    );
  }
}
