import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IFormVisbilityService {

  private messageSource = new BehaviorSubject(true);
  currentMessage = this.messageSource.asObservable();

  constructor() {
  }

  changeMessage(minimized: boolean) {
    console.log("changing minimized to : " + minimized);
    this.messageSource.next(minimized)
  }
}
