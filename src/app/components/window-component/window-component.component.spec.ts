import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WindowComponentComponent} from './window-component.component';

describe('WindowComponentComponent', () => {
  let component: WindowComponentComponent;
  let fixture: ComponentFixture<WindowComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WindowComponentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WindowComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
