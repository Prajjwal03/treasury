import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportRegerationComponent} from './report-regeration.component';

describe('ReportRegerationComponent', () => {
  let component: ReportRegerationComponent;
  let fixture: ComponentFixture<ReportRegerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportRegerationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportRegerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
