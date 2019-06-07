import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StacksToolbarComponent} from './stacks-toolbar.component';

describe('StacksToolbarComponent', () => {
  let component: StacksToolbarComponent;
  let fixture: ComponentFixture<StacksToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StacksToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StacksToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
