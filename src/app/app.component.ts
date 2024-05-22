import {Component, HostListener} from '@angular/core';
import {AuthenticationService} from './services/authentication.service';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  error: boolean = false
  userDetails = {
    "userName": '',
    "cabinetName": '',
    "serverIP": '',
    "port": '',
    "sessionID": '',
    "userIndex": '',
  }

  title: string = 'EPIXTransactionsWeb';
  currentUser: any;
  public field: any = {
    randomNumber: '',
    userIndex: ''
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    console.log("Processing beforeunload...");
    sessionStorage.clear()
    this.authenticationService.logout();
    this.error = true;
    this.router.navigate(['/login']);
  }

  constructor(private router: Router, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.getParamValueQueryString();
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      window.localStorage.setItem("sessionID", JSON.parse(sessionStorage.getItem("currentUser")).sessionID);
    }

  }

  getParamValueQueryString() {
    const url = window.location.href;

    if (url.includes('?')) {
      const httpParams = new HttpParams({fromString: url.split('?')[1]});
      this.userDetails.userName = httpParams.get("userName");
      this.userDetails.sessionID = httpParams.get("sessionID");
      this.userDetails.serverIP = httpParams.get("serverIP");
      this.userDetails.userIndex = httpParams.get("userIndex");
      this.userDetails.cabinetName = httpParams.get("cabinetName");
      console.log('userDetails', this.userDetails)
      this.authenticationService.loginSSO(this.userDetails)
    }
  }
}
