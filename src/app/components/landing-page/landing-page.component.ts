import {Component, OnInit, ViewChild, OnDestroy, ElementRef} from '@angular/core';
import {trigger, state, style, group, transition, animate} from '@angular/animations';
import {TableService} from 'src/app/services/table.service';
import {CommonEnquiryService} from 'src/app/services/common-enquiry.service';
import {TabsComponent} from 'src/app/tabs/tabs/tabs.component';
import {Router, ActivatedRoute} from '@angular/router';
import {PopUPService} from 'src/app/services/pop-up.service';
import {AuthenticationService} from 'src/app/services/authentication.service';
import {InputService} from 'src/app/services/input.service';
import {AppConfigServiceService} from 'src/app/services/app-config-service.service';
import * as moment from 'moment-timezone';
import {Idle, DEFAULT_INTERRUPTSOURCES, EventTargetInterruptSource} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {PopUPComponent} from '../pop-up/pop-up.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms linear', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('400ms linear', style({transform: 'translateX(-200%)'}))
      ])
    ])]
})
export class LandingPageComponent implements OnInit, OnDestroy {

  applicationName: string
  subscription1$: Subscription
  subscription2$: Subscription
  subscription3$: Subscription
  subscription4$: Subscription
  subscriptions: Subscription[] = []
  subs: Subscription
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  countryDate: any
  tempBranchName: string
  tempProductName: string
  tempProductList: string[] = []
  currentField: string
  currentFieldName: string
  dateFormat: string = "'" + AppConfigServiceService.settings.Date.Format + " " + "HH:mm zzzz' : 'GMT+9' :ja"
  productName: string
  branchName: string
  enquiryTab: boolean = false
  dashboardTab: boolean = true
  reportTab: boolean = false
  isDFX: boolean = false;
  customDashboardTab: boolean = false;
  userIndex: number = JSON.parse(sessionStorage.getItem("currentUser")).userIndex
  userName = JSON.parse(sessionStorage.getItem("currentUser")).userName
  animationState = 'in';
  show: boolean = true;
  showIcon: boolean = true;
  admin: boolean = true;
  menuState: string = 'out';
  smallmenuState: string = 'in';

  dropDownData: any
  dropdownDataMap: any = {}
  branchTimeJson: any = {}
  branchCode: any = ""
  productCode: any = ""
  obj = {
    prodctName: '',
    productCode: '',
    branchName: '',
    branchCode: ''
  }
  timer: any = "";
  isPopupOpen: boolean;
  @ViewChild(TabsComponent, {static: false}) TabsComponent: TabsComponent;
  @ViewChild('modelIDSubmitDashboard', {static: false}) modelIDSubmitDashboard: ElementRef;
  val: number = new Date().getTimezoneOffset()
  timeZOneOffsetBranch = new Date(new Date().getTime() + (this.val * 6000))
  timeZOneOffsetSSC = new Date(new Date().getTime() + (this.val * 6000))
  currentTab: string = 'dashboard';
  idleStartSubscription$: Subscription;
  idleEndSubscription$: Subscription;
  idleOnTimeOutWarningSubscription$: Subscription;
  idleOnTimeOutSubscription$: Subscription;
  idleTime: number = AppConfigServiceService.settings.TimeOut.setIdle;
  timeOut: number = AppConfigServiceService.settings.TimeOut.setTimeout;

  constructor(private inputService: InputService, private authenticationService: AuthenticationService,
              private popUPService: PopUPService, private route: ActivatedRoute,
              private router: Router, private enquiryService: CommonEnquiryService, private tableService: TableService,
              private commonEnquiryService: CommonEnquiryService, private idle: Idle, private keepalive: Keepalive,
              private element: ElementRef) {
    console.log("landing page controller loads");


    idle.setIdle(this.idleTime);
    idle.setTimeout(this.timeOut);

    idle.setInterrupts([
      new EventTargetInterruptSource(
        this.element.nativeElement, 'keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll')]);

    this.idleEndSubscription$ = idle.onIdleEnd.subscribe(() => {
      console.log('onIdleEnd');
      this.reset();
      this.idleState = 'No longer idle.'
    });

    this.idleOnTimeOutWarningSubscription$ = idle.onTimeoutWarning.subscribe((count: any) => {
      console.log('onTimeoutWarning');
    });

    this.idleOnTimeOutSubscription$ = idle.onTimeout.subscribe(() => {
      console.log('onTimeout');
      this.idleState = 'Session Timeout!';
      this.popUPService.close();
      if (this.authenticationService.loginMethod === 'MANUVAL') {
        this.popUPService.confirm1("Your Session Expired");
      }
      this.reset();
      this.authenticationService.logout();
      this.destroySubscriptions();
    });

    this.idleStartSubscription$ = idle.onIdleStart.subscribe(() => {
      console.log('OnIdleStart');
      this.idleState = 'Session is about to Expire. Do you want to Continue?';
      this.popUPService.confirm(this.idleState).then((confirmed) => {
        if (!confirmed) {
          idle.stop();
          this.authenticationService.logout();
          this.destroySubscriptions();
        } else {
          this.reset();
        }
      }).catch(() => {
        console.log('User dismissed the dialog ');
        this.reset();
      });
    });

    this.authenticationService.idleService.getLog().subscribe((data: any) => {
      console.log(data);
      if (data.logout) {
        idle.stop();
      }
    });

    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();

    this.commonEnquiryService.getUserName(this.userIndex).subscribe(data => {
      if (data['result'][0].FamilyName === undefined) {
        this.userName = data['result'][0].PersonalName
      } else {
        this.userName = data['result'][0].PersonalName + ' ' + data['result'][0].FamilyName
      }
    });

    if (this.inputService.setBranchAndProduct.currentTab === '') {
      this.inputService.setBranchAndProduct.currentTab = this.currentTab;
    } else {
      this.dashboardTab = this.inputService.setBranchAndProduct.currentTab === 'dashboard';
      this.enquiryTab = this.inputService.setBranchAndProduct.currentTab === 'enquiry';
      this.reportTab = this.inputService.setBranchAndProduct.currentTab === 'report';
      this.customDashboardTab = this.inputService.setBranchAndProduct.currentTab === 'customDashboard';
    }

  }

  destroySubscriptions() {
    this.idleStartSubscription$.unsubscribe();
    this.idleOnTimeOutSubscription$.unsubscribe();
    this.idleOnTimeOutWarningSubscription$.unsubscribe();
    this.idleEndSubscription$.unsubscribe();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }


  setDate() {
    setInterval(() => {
      var branchTime = new Date()
      var jun = moment(branchTime);
      this.timeZOneOffsetSSC = jun.tz('Asia/Kuala_Lumpur').format('DD-MMM-YYYY HH:mm')
      this.timeZOneOffsetBranch = jun.tz(this.branchTimeJson[this.tempBranchName]).format('DD-MMM-YYYY HH:mm')
    }, 1);
  }

  ngOnInit() {
    this.applicationName = "EP.IX Treasury";
    this.branchTimeJson = AppConfigServiceService.settings.Date.BranchTime
    console.log('daten format ', AppConfigServiceService.settings.Date.Format)
    this.commonEnquiryService.getApplications().subscribe(data => {
      console.log(data);
      this.dropdownDataMap['Application'] = data['result']
    })

    this.commonEnquiryService.getBranch(this.userIndex).subscribe(data => {

      if (data['result'] !== '' && data['result'] !== undefined && data['result'] != null) {
        this.dropdownDataMap['Branch'] = data['result']
        this.branchName = data['result'][0].BranchName
        console.log('date country', AppConfigServiceService.settings.Date.branch)
        this.tempBranchName = this.branchName.toLowerCase()
        console.log('date country', this.tempBranchName)
        this.setDate()

        this.branchCode = data['result'][0].BranchCode
        this.commonEnquiryService.getProduct(this.userIndex, data['result'][0].BranchName).subscribe(productData => {
          this.dropdownDataMap['Product'] = productData['result']
          this.productName = productData['result'][0].productName
          this.productCode = productData['result'][0].productCode
          console.log('*****ngOnInit Outside isDFX flag: ', this.isDFX)
          console.log('*****ngOnInit Product and product code: ', this.productName, this.productCode)
          if (this.productCode === 'DFX') {
            this.isDFX = true
            console.log('*****ngOninit inside if isDFX flag: ', this.isDFX)
          } else {
            console.log('*****ngOninit inside else isDFX flag: ', this.isDFX)
            this.isDFX = false
          }

          this.obj.branchCode = this.branchCode
          this.obj.productCode = this.productCode
          this.obj.branchName = this.branchName
          this.obj.prodctName = this.productName
          this.tempProductName = this.productName
          this.inputService.sendMessage(this.obj);

          this.tempProductList = this.dropdownDataMap['Product']
          console.log('*****ngOnInit tempBranchName: ', this.tempBranchName, "\n tempProductName: ", this.tempProductName,
            "\n tempProductList: ", this.tempProductList)
        })

      } else {
        document.getElementById("openModalButtonForNoBranch").click();
        console.log('Branch is empty')
      }
    })

  }

  showMenu() {

    this.showIcon = !(this.showIcon);
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
    this.smallmenuState = this.menuState === 'out' ? 'in' : 'out';

  }

  setApp() {
    console.log("vaishali");

    this.applicationName = "EP.IX Treasury";


  }

  setApplication(applicationLink) {
    this.dropdownDataMap['Application'].forEach(element => {
      if (element.application === this.applicationName) {
        window.open(element.applicationLink, "_blank");


        setTimeout(() => {
          this.setApp();
        }, 1000);

        console.log("vaishali", element.application, this.applicationName);
      }
    });
  }

  async modalEnquiry() {
    await this.changeBranchAndProduct(this.currentField, this.currentFieldName)
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('error');
      });
    this.tableService.setNoOFTabs(-1)
    this.currentTab = 'enquiry';
    this.inputService.setBranchAndProduct.currentTab = 'enquiry';
    this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/enquiry']);
    });
    this.tableService.setNavigation('enquiry')
    this.enquiryTab = true
    this.reportTab = false;
    this.dashboardTab = false;
    this.customDashboardTab = false;

  }

  modalEnquiryCancel() {

    console.log('before modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);

    this.branchName = this.capitalizeFirstLetter(this.tempBranchName);
    this.dropdownDataMap['Product'] = this.tempProductList;
    this.productName = this.tempProductName;
    console.log('after modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);

  }

  numberOfTabsForEnquiry() {

    if (TableService.noOfTabs >= 0) {
      document.getElementById("openModalButtonEnquiry").click();
    } else {
      this.router.navigate(['/enquiry']);
      this.enquiryTab = true;
      this.reportTab = false;
      this.dashboardTab = false;
      this.customDashboardTab = false;

    }
  }

  async modalReport() {
    await this.changeBranchAndProduct(this.currentField, this.currentFieldName)
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('error');
      });
    this.tableService.setNoOFTabs(-1)
    this.currentTab = 'report';
    this.inputService.setBranchAndProduct.currentTab = 'report';
    this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/reportGeneration']);
    });
    this.tableService.setNavigation(['/reportGeneration']);
    this.enquiryTab = false
    this.reportTab = true;
    this.dashboardTab = false;
    this.customDashboardTab = false;


  }

  modalReportCancel() {

    console.log('before modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);

    this.branchName = this.capitalizeFirstLetter(this.tempBranchName);
    this.dropdownDataMap['Product'] = this.tempProductList;
    this.productName = this.tempProductName;
    console.log('after modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);

  }

  numberOfTabsForReport() {
    if (TableService.noOfTabs >= 0) {
      document.getElementById("openModalButtonReport").click();
    } else {
      this.router.navigate(['/reportGeneration']);
      this.enquiryTab = false
      this.reportTab = true;
      this.dashboardTab = false;
      this.customDashboardTab = false;

    }
  }

  async modalDashboard() {
    await this.changeBranchAndProduct(this.currentField, this.currentFieldName)
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('error');
      });
    this.tableService.setNoOFTabs(-1)
    this.currentTab = 'dashboard';
    this.inputService.setBranchAndProduct.currentTab = 'dashboard';
    this.router.navigateByUrl('/enquiry', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/dashboard']);
    });
    this.enquiryTab = false
    this.reportTab = false;
    this.dashboardTab = true;
    this.customDashboardTab = false;

  }

  modalDashboardCancel() {
    console.log('before modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);
    this.branchName = this.capitalizeFirstLetter(this.tempBranchName);
    this.dropdownDataMap['Product'] = this.tempProductList;
    this.productName = this.tempProductName;
    console.log('after modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);

  }

  capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  numberOfTabsForDashboard() {
    if (TableService.noOfTabs >= 0) {
      document.getElementById("openModalButtonDashboard").click();
    } else {
      this.router.navigate(['/dashboard']);
      this.enquiryTab = false
      this.reportTab = false;
      this.dashboardTab = true;
      this.customDashboardTab = false;
    }
  }

  async modalCustomDashboard() {
    await this.changeBranchAndProduct(this.currentField, this.currentFieldName)
      .then(() => {
        console.log('success');
      })
      .catch(() => {
        console.log('error');
      });
    this.tableService.setNoOFTabs(-1)
    this.currentTab = 'customDashboard';
    this.inputService.setBranchAndProduct.currentTab = 'customDashboard';
    this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(() => {
      this.router.navigate(['/customDashboard']);
    });
    this.tableService.setNavigation('customDashboard')
    this.enquiryTab = false
    this.reportTab = false;
    this.dashboardTab = false;
    this.customDashboardTab = true;
  }

  async modalCustomDashboardCancel() {
    console.log('before modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);
    this.branchName = this.capitalizeFirstLetter(this.tempBranchName);
    this.dropdownDataMap['Product'] = this.tempProductList;
    this.productName = this.tempProductName;
    console.log('after modalCancel ', this.branchName + " " + this.productName + " " + this.dropdownDataMap['Product']);

  }

  numberOfTabsForCustomDashboard() {
    if (TableService.noOfTabs >= 0) {
      document.getElementById("openModalButtonCustomDashboard").click();
    } else {
      this.router.navigate(['/customDashboard']);
      this.enquiryTab = false
      this.reportTab = false;
      this.dashboardTab = false;
      this.customDashboardTab = true;
    }
  }

  async modalLogout() {
    this.tableService.setNoOFTabs(-1)
    this.deleteIframe()
    await this.authenticationService.logout();
  }

  logout() {
    if (TableService.noOfTabs >= 0) {
      document.getElementById("openModalButtonLogout").click();
    } else {
      this.tableService.setNoOFTabs(-1)
      this.deleteIframe()
      this.authenticationService.logout();

    }
  }

  async setDropDown(field, fieldName) {
    this.currentField = field;
    this.currentFieldName = fieldName;
    var currentWindowUrl = window.location.href;
    if (TableService.noOfTabs >= 0 && currentWindowUrl.includes('report')) {
      document.getElementById("openModalButtonReport").click();
    } else if (TableService.noOfTabs >= 0 && currentWindowUrl.includes('dashboard')) {
      document.getElementById("openModalButtonDashboard").click();
    } else if (TableService.noOfTabs >= 0 && currentWindowUrl.includes('enquiry')) {
      document.getElementById("openModalButtonEnquiry").click();
    } else if (TableService.noOfTabs >= 0 && currentWindowUrl.includes('customDashboard')) {
      document.getElementById("openModalButtonCustomDashboard").click();
    } else {
      await this.changeBranchAndProduct(this.currentField, this.currentFieldName)
        .then(() => {
          console.log('success');
        })
        .catch(() => {
          console.log('error');
        });
      this.tempProductList = this.inputService.setBranchAndProduct.getProduct();
      this.tempBranchName = this.branchName.toLowerCase();
      this.tempProductName = this.productName;
      if (TableService.noOfTabs < 0 && currentWindowUrl.includes('customDashboard') ||
        TableService.noOfTabs < 0 && currentWindowUrl.includes('dashboard') ||
        TableService.noOfTabs < 0 && currentWindowUrl.includes('enquiry') ||
        TableService.noOfTabs < 0 && currentWindowUrl.includes('report')) {
        this.router.navigate(['/dashboard']);
        this.enquiryTab = false
        this.reportTab = false;
        this.dashboardTab = true;
        this.customDashboardTab = false;
      }
    }

  }

  async changeBranchAndProduct(field, fieldName) {
    if (fieldName === 'Branch') {
      await this.setBranch(field, this.userIndex)
        .then(() => {
          console.log('success');
        })
        .catch(() => {
          console.log('error');
        })
    } else if (fieldName === 'Product') {
      await this.dropdownDataMap['Product'].forEach(element => {
        if (element.productName === field) {
          this.productCode = element.productCode;
          this.obj.prodctName = field;
          this.obj.productCode = this.productCode;
          let obj: any = this.inputService.setBranchAndProduct.getObj();
          this.obj.branchCode = obj.branchCode;
          this.obj.branchName = obj.branchName;
          console.log('object before setting product code and name ', this.inputService.setBranchAndProduct.getObj());
          obj.prodctName = field;
          obj.productCode = this.productCode;
          console.log('object after setting product code and name ', this.inputService.setBranchAndProduct.getObj());
          this.inputService.sendMessage(obj);
          this.inputService.setBranchAndProduct.setObj(obj);
          this.getIFormData();
        }
      });
    }
  }

  setBranch(field, userIndex) {
    this.branchName = field;
    return new Promise((resolve, reject) => {
      this.setDate();
      this.dropdownDataMap['Branch'].forEach(async (element: { BranchName: string; BranchCode: string; }) => {
        if (element.BranchName === field) {
          this.obj.branchCode = element.BranchCode;
          this.obj.branchName = element.BranchName;
          console.log('commonEnquiryService ', this.commonEnquiryService);
          await this.commonEnquiryService.getProduct(userIndex, field).toPromise()
            .then(data => {
              console.log('dropDownDataMap Product ', this.dropdownDataMap['Product']);
              this.dropdownDataMap['Product'] = data['result'];
              console.log('dropDownDataMap Product ', this.dropdownDataMap['Product']);
              this.productName = data['result'][0].productName;
              this.productCode = data['result'][0].productCode;
              this.obj.productCode = this.productCode;
              this.obj.prodctName = this.productName;
              console.log('*****Outside isDFX flag: ', this.isDFX)
              console.log('*****product code: ', this.productCode)
              if (this.productCode === 'DFX') {
                this.isDFX = true
                console.log('*****inside If isDFX flag true')
              } else {
                this.isDFX = false
                console.log('*****inside else isDFX flag false')
              }
              console.log("before setting obj ", this.inputService.setBranchAndProduct.getObj());
              this.inputService.setBranchAndProduct.setObj(this.obj);
              console.log("after setting obj ", this.inputService.setBranchAndProduct.getObj());
              this.inputService.setBranchAndProduct.setProduct(data['result']);
              resolve('success');
            }).catch(err => {
              console.log(err);
              reject('error');
            })
          this.inputService.sendMessage(this.obj);
          this.tempBranchName = this.branchName;
          this.tempProductName = this.productName;
          this.tempProductList = this.dropdownDataMap['Product'];
        }
      })
    })
  }

  clearMessage(): void {

    this.inputService.clearMessage();
  }

  sessionValidation() {
    this.tableService.sessionValidation()
  }

  deleteIframe() {
  }

  TimeOut() {
    console.log("inside timeout");
    this.popUPService.closePopup();
    this.popUPService.confirm1("Your Session Expired");
    sessionStorage.removeItem('currentUser');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    console.log("inside ngondestroy");
    try {
      console.log("inside try block")
      this.subscription1$.unsubscribe();
      this.subscription2$.unsubscribe();
      this.subs.unsubscribe();
    } catch (error) {
      console.log(error, "in catch block");
    }
    this.destroySubscriptions();
  }

  getIFormData() {
    this.tableService.getIformDetails(this.productCode).subscribe((data: any) => {
      this.inputService.setBranchAndProduct.setIFormData(data);
    });
  }
}
