import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopUPComponent} from '../components/pop-up/pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class PopUPService {

  constructor(private modalService: NgbModal) {
  }

  confirm(
    title: string,
    message: string = null,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(PopUPComponent, {size: dialogSize});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    return modalRef.result;
  }

  confirm1(
    title: string,
    btnOkText: string = 'OK',
    btnCancelText: string = null,
    dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(PopUPComponent, {size: dialogSize});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.btnOkText = btnOkText;
    return modalRef.result;
  }

  closePopup() {
    this.modalService.dismissAll(PopUPComponent);
  }

  close() {
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
  }
}
