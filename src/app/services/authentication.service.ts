import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/user';
import {AppConfigServiceService} from './app-config-service.service';
import {InputService} from './input.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private login_url: string = AppConfigServiceService.settings.Login.UserLogin;
  private forceLogin_url: string = AppConfigServiceService.settings.Login.ForceLogin;
  private session_url: string = AppConfigServiceService.settings.Login.UserSession;
  private logout_url: string = AppConfigServiceService.settings.Login.Logout;

  restAPI_URL = AppConfigServiceService.settings.ServerURL.RestAPI
  session_URL = this.restAPI_URL + AppConfigServiceService.settings.REstAPIServer.SessionStatus
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  public status: string;
  public sessionStatus: string;

  public password: string;
  public userDBID: string;
  public cabinetName: string;
  public ServerIP: string;
  public PortNumber: string;
  public userCredentialsJSON: any;
  public loginMethod: string = 'SSO';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    })
  };

  constructor(private inputService: InputService, private http: HttpClient, private router: Router,) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getsessionValid(cabinetName: string, password: string, userDBID: string, ServerIP: string, PortNumber: string): Observable<any> {
    return this.http.get<any>(this.session_url, {params: {cabinetName, password, userDBID, ServerIP, PortNumber}});
  }

  logout() {
    const userCredentials = {
      userName: JSON.parse(sessionStorage.getItem("currentUser")).userName,
      cabinetName: JSON.parse(sessionStorage.getItem("currentUser")).cabinetName,
      sessionID: JSON.parse(sessionStorage.getItem("currentUser")).sessionID,
      serverIP: JSON.parse(sessionStorage.getItem("currentUser")).serverIP,
      port: JSON.parse(sessionStorage.getItem("currentUser")).port
    };

    this.userCredentialsJSON = JSON.stringify(userCredentials);
    return this.http.post<any>(this.logout_url, this.userCredentialsJSON,
      this.httpOptions)
      .subscribe(statuss => {
        console.log('status', statuss)
        if (statuss) {
          var logoutStatus = statuss["result"].status;
          if (logoutStatus == "0") {
            this.inputService.sendMessage(undefined)
            sessionStorage.removeItem('currentUser');
            sessionStorage.clear();
            this.currentUserSubject.next(null);
            this.idleService.setLog();
            if (this.loginMethod == 'SSO') {
              this.router.navigate(['/error', 'SSO'], {skipLocationChange: false});
            } else {
              this.router.navigate(['/login'], {skipLocationChange: false});
            }
          }
        }
      });
  }

  killSession() {
    const userCredentials = {
      userName: JSON.parse(sessionStorage.getItem("currentUser")).userName,
      cabinetName: JSON.parse(sessionStorage.getItem("currentUser")).cabinetName,
      sessionID: JSON.parse(sessionStorage.getItem("currentUser")).sessionID,
      serverIP: JSON.parse(sessionStorage.getItem("currentUser")).serverIP,
      port: JSON.parse(sessionStorage.getItem("currentUser")).port
    };

    this.userCredentialsJSON = JSON.stringify(userCredentials);
    return this.http.post<any>(this.logout_url, this.userCredentialsJSON,
      this.httpOptions)
      .subscribe(status => {
        console.log('status', status)
      });
  }

  login(username: string, password: string) {
    const userCredentials = {
      userName: username,
      password: password
    };

    this.userCredentialsJSON = JSON.stringify(userCredentials);
    userCredentials.userName = username;
    return this.http.post<any>(this.login_url, this.userCredentialsJSON, this.httpOptions)
      .pipe(map(user => {
        console.log("login success");
        if (user && user.result) {
          this.status = user.result.status;
          if (this.status == "0") {
            sessionStorage.setItem('currentUser', JSON.stringify(user.result));
            this.userDBID = JSON.parse(sessionStorage.getItem("userDBID"));
            this.currentUserSubject.next(user.result);
            console.log("login success" + this.currentUser);
          }

          return user;
        }
      }));
  }

  loginSSO(userDetails) {
    sessionStorage.setItem('currentUser', JSON.stringify(userDetails))
    this.currentUserSubject.next(userDetails);
    console.log("login success sso" + this.currentUser);
    this.loginMethod = 'SSO';
    this.router.navigate(['./dashboard']);
  }


  forceLogin(username: string, password: string) {
    const userCredentials = {
      userName: username,
      password: password
    };

    this.userCredentialsJSON = JSON.stringify(userCredentials);
    userCredentials.userName = username;
    console.log("INside  forceLogin ");
    return this.http.post<any>(this.forceLogin_url, this.userCredentialsJSON, this.httpOptions)
      .pipe(map(user => {
        console.log("login forceLogin success");
        if (user && user.result) {
          this.status = user.result.status;
          if (this.status == "0") {
            sessionStorage.setItem('currentUser', JSON.stringify(user.result));
            this.userDBID = JSON.parse(sessionStorage.getItem("currentUser")).sessionID;
            this.currentUserSubject.next(user.result);
            console.log("forceLogin success" + this.currentUser);
          } else {
            console.log("login unsuccessful");
          }
          return user;
        }
      }));
  }

  sessionAuthenticate(cabinetName: string, password: string, userDBID: string, ServerIP: string, PortNumber: string) {
    const s = this.http.get<any>(this.session_url, {params: {cabinetName, password, userDBID, ServerIP, PortNumber}})
      .subscribe(statuss => {
        console.log("Response Received" + statuss.result);
        this.sessionStatus = statuss.result;
      });
    return s;
  }

  getSessionStatus(field) {
    return this.http.post(this.session_URL, {field})
  }

  idleSub = new Subject<any>();
  public idleService = {
    getLog: () => {
      return this.idleSub;
    },

    setLog: () => {
      this.idleSub.next({logout: true});
    }
  }
}
