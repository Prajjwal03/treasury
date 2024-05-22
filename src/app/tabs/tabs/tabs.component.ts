import {
  Component, AfterContentInit, NgZone, ContentChildren,
  QueryList, ViewChild, ComponentFactoryResolver, ViewEncapsulation, Input, Output, EventEmitter
} from '@angular/core';
import {TabComponent} from '../tab/tab.component';
import {DynamicTabsDirective} from '../dynamic-tabs.directive';
import {NotificationsService} from 'angular2-notifications';
import {TableService} from 'src/app/services/table.service';
import {WorkItemService} from 'src/app/services/work-item.service';
import {PopUPService} from 'src/app/services/pop-up.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabsComponent implements AfterContentInit {
  tabTemp: TabComponent
  public xmlItems: any;
  transactionRefNo: any
  closeFlag: boolean = false
  transacID: any
  modelIDSubmit: any
  @Input() activeTab: string;
  @Output() activeTabChanged = new EventEmitter();
  tabNameFlag: boolean = false
  modalMessage: any
  dynamicTabs: TabComponent[] = [];

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  @ViewChild(DynamicTabsDirective, {static: false}) dynamicTabPlaceholder: DynamicTabsDirective;

  constructor(private popUPService: PopUPService, private zone: NgZone, private workItemService: WorkItemService, private tableService: TableService, private _componentFactoryResolver: ComponentFactoryResolver, private notif: NotificationsService) {
    window['subscribeToAlert'] = (message, control, type, referenceNo, processInstanceID) => {
      zone.run(() => {
        this.transactionRefNo = referenceNo
        this.modelIDSubmit = referenceNo + "submit"
        this.loadAlert(message, control, type, referenceNo, processInstanceID);
      });
    };
  }

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);

    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  openTabBC(title: string, template, isCloseable = false, lockStatus: boolean) {
    console.log('title first', title)

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      TabComponent
    );

    const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
    const componentRef = viewContainerRef.createComponent(componentFactory);
    const instance: TabComponent = componentRef.instance;
    instance.title = title;
    instance.template = template;
    instance.isCloseable = isCloseable;

    this.dynamicTabs.push(componentRef.instance);
    this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
  }

  TabExists(transID) {
    var result = false;
    for (let i in this.dynamicTabs) {
      if (this.dynamicTabs[i].title === transID) {
        this.selectTab(this.dynamicTabs[+i]);
        result = true;
        break;
      }
    }

    return result;
  }

  openTab(title: string, template, data, isCloseable = false) {

    if (!this.TabExists(data.transactionID)) {
      this.transacID = data.transactionID
      var temp = 0

      if (this.dynamicTabs.length < 5) {
        const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
          TabComponent
        );
        const viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        const componentRef = viewContainerRef.createComponent(componentFactory);
        const instance: TabComponent = componentRef.instance;
        instance.title = ""
        instance.template = template;
        instance.dataContext = data
        instance.isCloseable = isCloseable;

        this.tableService.setNoOFTabs(this.dynamicTabs.length)
        if (title == "") {
          instance.title = "New Transaction"
          instance.LockStatus = "N"
        } else {
          instance.LockStatus = data.LockStatus
          instance.title = title;
        }

        if (this.dynamicTabs.length === 0) {
          this.dynamicTabs.push(componentRef.instance);
          this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
        } else {
          temp = 1;
          for (let i in this.dynamicTabs) {
            if (this.dynamicTabs[i].title === title) {
              this.selectTab(this.dynamicTabs[+i]);
              temp = temp + 1;
            }
          }

          if (temp === 1) {
            this.dynamicTabs.push(componentRef.instance);
            this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
          }
        }
      } else {
        temp = 1;
        for (let i in this.dynamicTabs) {
          console.log('i', i)
          console.log(this.dynamicTabs[i].title)
          if (this.dynamicTabs[i].title === title) {
            console.log()
            this.selectTab(this.dynamicTabs[+i]);
            temp = temp + 1;
          }
        }

        if (temp === 1) {
          this.notif.warn(
            'Maximum 5 Tabs Can be opened',
            'Close any Tab to open new tab',
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
    }
  }

  selectTab(tab: TabComponent) {
    console.log('inside select tab')
    this.tabs.toArray().forEach(tab => (tab.active = false));
    this.dynamicTabs.forEach(tab => (tab.active = false));
    tab.active = true;
    this.activeTab = tab.title;
    this.activeTabChanged.emit(this.activeTab);
  }

  NotSave() {
    this.singleCloseTab(this.tabTemp)
  }

  closeTab(tab: TabComponent) {
    this.tabTemp = tab
    console.log('inside close tab', tab)
    console.log('tab title: ', tab.title)
    if (this.transacID !== 'Report') {
      this.transacID = tab.title
    }
    this.closeFlag = tab.closeFlag
    if (this.transacID !== 'New Transaction' && this.transacID !== undefined && this.transacID !== null) {
      if (this.transacID !== 'Report' && tab.dataContext.statuscode !== '16') {
        if (this.closeFlag) {
          this.singleCloseTab(tab)
        } else {
          document.getElementById("openModalButtonNotSave").click();
        }
      } else {
        this.singleCloseTab(tab)
      }

    } else {
      document.getElementById("openModalButtonDelete").click();
    }
  }

  deleteTransaction() {
    console.log("WorkItem to be deleted:" + this.tabTemp.dataContext.pid);
    this.workItemService.deleteWorkItem(this.tabTemp.dataContext.pid);
    this.singleCloseTab(this.tabTemp)
  }

  autoCloseTab(tab: TabComponent) {
    console.log('single close', tab)
    this.selectTab(this.tabs.first);
    this.tableService.setNoOFTabs(this.dynamicTabs.length - 2)
    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i] === tab) {
        console.log('id i', i)
        this.dynamicTabs.splice(i, 1);
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        viewContainerRef.remove(i);
        this.selectTab(this.tabs.first);
        break;
      }
    }
  }

  singleCloseTab(tab: TabComponent) {
    this.deleteIframe(tab)
    console.log('single close', tab)
    this.selectTab(this.tabs.first);
    this.tableService.setNoOFTabs(this.dynamicTabs.length - 2)
    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i] === tab) {
        console.log('id i', i)
        this.dynamicTabs.splice(i, 1);
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        viewContainerRef.remove(i);
        this.selectTab(this.tabs.first);
        break;
      }
    }
    if (tab.dataContext.pid !== undefined && tab.dataContext.pid !== null && tab.dataContext.pid !== '' && tab.dataContext.statuscode !== '16') {
      this.workItemService.unlockWorkItem(tab.dataContext.pid, tab.dataContext.workItemId).subscribe(data => {
        console.log(data)
        document.getElementById("TeamToDoRefreshingPage").click();
      })
    }
  }

  close(tab: TabComponent) {
    this.deleteIframe(tab)
    console.log('inside close tab')
    console.log('Tab: ', tab)
    this.selectTab(this.tabs.first);
    this.tableService.setNoOFTabs(this.dynamicTabs.length - 2)
    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i] === tab) {
        console.log('id i', i)
        this.dynamicTabs.splice(i - 1, 1);
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
        viewContainerRef.remove(i);
        this.selectTab(this.tabs.first);
        break;
      }
    }
  }

  closeActiveTab() {
    console.log('trigger inside cloase')
    const activeTabs = this.dynamicTabs.filter(tab => tab.active);
    if (activeTabs.length > 0) {
      console.log(activeTabs[0])
      this.closeTab(activeTabs[0]);
    }
  }

  unlocktab(tab: TabComponent) {

  }

  numberOfTabs(): any {
    return this.dynamicTabs.length;
  }

  loadAlert(message, control, type, referenceNo, processInstanceID) {
    console.log(message, control, type, referenceNo, processInstanceID)
    console.log("inside tab")

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
      this.transacID = referenceNo

      if (control == 'Save' && type == 'Success') {
        for (let i = 0; i < this.dynamicTabs.length; i++) {
          if (this.dynamicTabs[i].active) {
            this.dynamicTabs[i].title = referenceNo
            this.dynamicTabs[i].closeFlag = true
          }
        }

        this.modalMessage = message
        document.getElementById("openModalButtonForSave").click();
      }

      if (control == 'Submit' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'Discard' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'Approve' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'Reject' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'Cancel' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'ApproveCancellation' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'RejectCancellation' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'Hold' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }

      if (control == 'Post Cancel' && type == 'Success') {
        this.modalMessage = message
        document.getElementById("openModalButton").click();
      }
    }
  }

  autoClose() {
    this.tableService.setNoOFTabs(this.dynamicTabs.length - 2)

    for (let i = 0; i < this.dynamicTabs.length; i++) {
      if (this.dynamicTabs[i].active) {
        this.autoCloseTab(this.dynamicTabs[i])
        this.selectTab(this.tabs.first);
      }
    }

    document.getElementById("TeamToDoRefreshingPage").click();
  }

  deleteIframe(tab: TabComponent) {
    console.log('delete iframe---------' + 'iframe' + tab.dataContext.pid)

    let iframes: NodeListOf<Element> = document.querySelectorAll(`iframe[id=${'iframe' + tab.dataContext.pid}]`);
    iframes.forEach(data => {
      console.log(data)
    })
  }
}
