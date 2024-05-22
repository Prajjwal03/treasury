import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../services/authentication.service';
import {User} from "../models/user";

// todo are we using both AccessGuard or AuthGuard?
@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {

  public pswrd: string;
  public usrDBID: string;
  public cabinet: string;
  public srvrIP: string;
  public port: string;
  public sts: string;
  public response: Observable<any[]>;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser: User = this.authenticationService.currentUserValue;
    console.log("Inside canActivate");

    if (currentUser) {
      this.pswrd = currentUser.Password;
      this.usrDBID = currentUser.UserDBId;
      this.cabinet = currentUser.CabinetName;
      this.srvrIP = currentUser.ServerIP;
      this.port = currentUser.PortNumber;
      console.log("Inside canActivate" + currentUser);

      if (this.sts) {
        return true;
      }
    } else {
      return false;
    }
  }
}
