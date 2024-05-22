import {Injectable, Input} from '@angular/core';
import {Subject, Observable, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InputService {
  static input: any;
  private subject = new Subject<any>();

  constructor() {
  }

  sendMessage(message: any) {
    InputService.input = message
    this.subject.next({text: message});
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  public setBranchAndProduct = {
    branch: [],
    product: [],
    iFormData: {},
    branchProductFlag: false,
    obj: {},
    currentTab: '',

    setBranch: (data) => {
      this.setBranchAndProduct.branch = data;
    },

    setProduct: (data) => {
      this.setBranchAndProduct.product = data;
    },

    getBranch: () => {
      return this.setBranchAndProduct.branch;
    },

    getProduct: () => {
      return this.setBranchAndProduct.product;
    },

    setFlag: (flag) => {
      this.setBranchAndProduct.branchProductFlag = flag;
    },

    getFlag: () => {
      return this.setBranchAndProduct.branchProductFlag;
    },

    setIFormData: (data) => {
      this.setBranchAndProduct.iFormData = data;
    },

    getIFormData: () => {
      return this.setBranchAndProduct.iFormData;
    },

    setObj: (data) => {
      this.setBranchAndProduct.obj = data;
    },

    getObj: () => {
      return this.setBranchAndProduct.obj;
    }
  };
}
