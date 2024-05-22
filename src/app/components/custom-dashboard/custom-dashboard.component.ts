import {Component, OnInit} from '@angular/core';
import {TableService} from 'src/app/services/table.service';

@Component({
  selector: 'app-custom-dashboard',
  templateUrl: './custom-dashboard.component.html',
  styleUrls: ['./custom-dashboard.component.scss']
})
export class CustomDashboardComponent implements OnInit {
  public loading: boolean = false;
  valueTodayTicketsCountMap: any = new Map();
  valueTodayTicketsCCYCountMap: any = new Map();

  constructor(
    private tableService: TableService
  ) {
  }

  ngOnInit() {
    this.loadDetails();
  }

  loadDetails() {
    this.loading = true;
    this.tableService.getCustomDashboardSubProductData().subscribe(data => {
      this.valueTodayTicketsCountMap = new Map();
      let total = {
        Department: "Total",
        PendingTreasuryBack: 0,
        PendingOperationChecker: 0,
        PendingOperationMaker: 0,
        UtilizationCompleted: 0
      }

      if (data.result != "" && Array.isArray(data.result)) {
        data.result.forEach(element => {
          if (this.valueTodayTicketsCountMap.has(element.Department)) {
            let keyValue = this.valueTodayTicketsCountMap.get(element.Department);
            keyValue.push(element);
            this.valueTodayTicketsCountMap.set(element.Department, keyValue);

          } else {
            this.valueTodayTicketsCountMap.set(element.Department, [element]);
          }
          total.PendingTreasuryBack = total.PendingTreasuryBack + element.PendingTreasuryBack;
          total.PendingOperationChecker = total.PendingOperationChecker + element.PendingOperationChecker;
          total.PendingOperationMaker = total.PendingOperationMaker + element.PendingOperationMaker;
          total.UtilizationCompleted = total.UtilizationCompleted + element.UtilizationCompleted;
        });
      }

      this.valueTodayTicketsCountMap.set("Total", [total]);
      console.log(this.valueTodayTicketsCountMap)
      this.loading = false;
    })
    this.tableService.getCustomDashboardCurrencyData().subscribe(data => {
      this.valueTodayTicketsCCYCountMap = new Map();
      let total = {Department: "Total", PendingTreasuryBack: 0, PendingOperationChecker: 0, PendingOperationMaker: 0, UtilizationCompleted: 0}
      if (data.result != "" && Array.isArray(data.result)) {
        data.result.forEach(element => {
          if (this.valueTodayTicketsCCYCountMap.has(element.Department)) {
            let keyValue = this.valueTodayTicketsCCYCountMap.get(element.Department);
            keyValue.push(element);
            this.valueTodayTicketsCCYCountMap.set(element.Department, keyValue);
          } else {
            this.valueTodayTicketsCCYCountMap.set(element.Department, [element]);
          }
          total.PendingTreasuryBack = total.PendingTreasuryBack + element.PendingTreasuryBack;
          total.PendingOperationChecker = total.PendingOperationChecker + element.PendingOperationChecker;
          total.PendingOperationMaker = total.PendingOperationMaker + element.PendingOperationMaker;
          total.UtilizationCompleted = total.UtilizationCompleted + element.UtilizationCompleted;
        });
      }
      this.valueTodayTicketsCCYCountMap.set("Total", [total]);
      console.log(this.valueTodayTicketsCCYCountMap)
      this.loading = false;
    })
  }

  sessionValidation() {
    this.tableService.sessionValidation()
  }
}
