import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ReportParentComponent} from './report-parent.component';

describe('ReportParentComponent', () => {
  let component: ReportParentComponent;
  let fixture: ComponentFixture<ReportParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportParentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
