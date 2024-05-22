import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnquiryParentComponent} from './enquiry-parent.component';

describe('EnquiryParentComponent', () => {
  let component: EnquiryParentComponent;
  let fixture: ComponentFixture<EnquiryParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryParentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
