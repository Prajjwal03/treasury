import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnquiryEditDocumentsComponent} from './enquiry-edit-documents.component';

describe('EnquiryEditDocumentsComponent', () => {
  let component: EnquiryEditDocumentsComponent;
  let fixture: ComponentFixture<EnquiryEditDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnquiryEditDocumentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnquiryEditDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
