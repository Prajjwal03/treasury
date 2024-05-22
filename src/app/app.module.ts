import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {TabComponent} from './tabs/tab/tab.component';
import {TabsComponent} from './tabs/tabs/tabs.component';
import {DynamicTabsDirective} from './tabs/dynamic-tabs.directive';
import {DashboardTabsComponent} from './tabs/dashboard-tabs/dashboard-tabs.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {TeamsToDOComponent} from './components/teams-to-do/teams-to-do.component';
import {ToDoComponent} from './components/to-do/to-do.component';
import {WatchListComponent} from './components/watch-list/watch-list.component';
import {UserManagementComponent} from './components/user-management/user-management.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {ChartModule} from 'angular-highcharts';
import {HighchartsService} from './services/highcharts.service';
import {EnquiryComponent} from './components/enquiry/enquiry.component';
import {HttpClientModule} from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import {EnquiryEditComponent} from './components/enquiry-edit/enquiry-edit.component';
import {EnquiryParentComponent} from './components/enquiry-parent/enquiry-parent.component';
import {LoginComponent} from './components/login/login.component';
import localeJa from '@angular/common/locales/ja';
import {PopUPService} from './services/pop-up.service';
import {PopUPComponent} from './components/pop-up/pop-up.component';
import {AppConfigServiceService} from './services/app-config-service.service';
import {APP_BASE_HREF, DatePipe, registerLocaleData} from '@angular/common';
import {RemovewhitespacesPipe} from './RemovewhitespacesPipe ';
import {NgDatepickerModule} from 'ng2-datepicker';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FileUploadModule} from 'ng2-file-upload';
import {ReportRegerationComponent} from './components/report-regeration/report-regeration.component';
import {CustomDashboardComponent} from './components/custom-dashboard/custom-dashboard.component';
import {EnquiryEditDocumentsComponent} from './components/enquiry-edit-documents/enquiry-edit-documents.component';
import {WindowComponentComponent} from './components/window-component/window-component.component';
import {FormUploadComponent} from './components/form-upload/form-upload.component';
import {DateParserFormatter} from './components/date-parser-formater';
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';
import {MglTimelineModule} from 'angular-mgl-timeline';
import {VerticalTimelineModule} from 'angular-vertical-timeline';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import {NgxLoadingModule} from 'ngx-loading';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReportParentComponent} from './components/report-parent/report-parent.component';
import {ReportEditComponent} from './components/report-edit/report-edit.component';
import {UserName} from './components/user-name';
import {ErrorComponent} from './components/error/error.component';
import {ChartsModule} from 'ng2-charts';
import {SessionExpireComponent} from './session-expire/session-expire.component';
import {InputService} from './services/input.service';

registerLocaleData(localeJa, 'ja');

export function startupServiceFactory(startupService: AppConfigServiceService): Function {
  return () => startupService.load();
}

export function getBaseHref(): string {
  return window.location.pathname;
}

@NgModule({

  declarations: [
    UserName,
    LoginComponent,
    PopUPComponent,
    RemovewhitespacesPipe,
    AppComponent,
    LandingPageComponent,
    TabComponent,
    TabsComponent,
    DynamicTabsDirective,
    DashboardTabsComponent,
    DashboardComponent,
    TeamsToDOComponent,
    ToDoComponent,
    WatchListComponent,
    UserManagementComponent,
    EnquiryComponent,
    EnquiryEditComponent,
    EnquiryParentComponent,
    ReportRegerationComponent,
    CustomDashboardComponent,
    EnquiryEditDocumentsComponent,
    WindowComponentComponent,
    FormUploadComponent,
    ReportParentComponent,
    ReportEditComponent,
    ErrorComponent,
    SessionExpireComponent
  ],
  imports: [
    NgxLoadingModule.forRoot({}),
    VerticalTimelineModule,
    MatAutocompleteModule,
    SimpleNotificationsModule.forRoot({
      position: ["top", "right"],
      timeOut: 5000,
      lastOnBottom: true
    }),
    NgIdleKeepaliveModule.forRoot(),
    MglTimelineModule,
    NgxDaterangepickerMd.forRoot(),
    FileUploadModule,
    NgbModule,
    ChartsModule,
    NgDatepickerModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ChartModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule, BrowserAnimationsModule, MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule

  ],
  providers: [
    PopUPService,
    HighchartsService,
    AppConfigServiceService,
    InputService, {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AppConfigServiceService],
      multi: true
    },
    {provide: NgbDateParserFormatter, useClass: DateParserFormatter},
    {provide: APP_BASE_HREF, useFactory: getBaseHref},
    DatePipe
  ],
  bootstrap: [AppComponent],
  entryComponents: [PopUPComponent, TabComponent]
})
export class AppModule {

}
