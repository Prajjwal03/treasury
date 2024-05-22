import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {EnquiryParentComponent} from './components/enquiry-parent/enquiry-parent.component';
import {ReportParentComponent} from './components/report-parent/report-parent.component';
import {CustomDashboardComponent} from './components/custom-dashboard/custom-dashboard.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {AppComponent} from './app.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {ErrorComponent} from './components/error/error.component';
import {SessionExpireComponent} from './session-expire/session-expire.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent, canActivate: [AuthGuard],
    children: [
      {path: 'dashboard', component: DashboardComponent},
      {path: 'enquiry', component: EnquiryParentComponent},
      {path: 'reportGeneration', component: ReportParentComponent},
      {path: 'customDashboard', component: CustomDashboardComponent}
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'error/:msg',
    component: ErrorComponent
  },
  {
    path: 'app/:userName',
    component: AppComponent
  },
  {
    path: 'sessionexpired',
    component: SessionExpireComponent
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];
export const appRoutingModule = RouterModule.forRoot(routes);

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
