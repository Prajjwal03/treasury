import {Component, ViewChild, OnInit, ComponentFactoryResolver, ApplicationRef, Injector, OnDestroy} from '@angular/core';
import {CdkPortal, DomPortalHost} from '@angular/cdk/portal';
import {IFormVisbilityService} from 'src/app/services/i-form-visbility.service';

// todo are we using this component
/**
 * This component template wrap the projected content
 * with a 'cdkPortal'.
 */
@Component({
  selector: 'window-component',
  templateUrl: './window-component.component.html',
  styleUrls: ['./window-component.component.scss']
})
export class WindowComponentComponent implements OnInit, OnDestroy {

  @ViewChild(CdkPortal, {static: true}) portal: CdkPortal;

  private externalWindow = null;

  minimized: boolean
  someInputField: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector, private data: IFormVisbilityService) {
  }

  ngOnInit() {
    this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

    const host = new DomPortalHost(
      this.externalWindow.document.body,
      this.componentFactoryResolver,
      this.applicationRef,
      this.injector
    );

    host.attach(this.portal);
  }

  ngOnDestroy() {
    this.externalWindow.close()
  }
}
