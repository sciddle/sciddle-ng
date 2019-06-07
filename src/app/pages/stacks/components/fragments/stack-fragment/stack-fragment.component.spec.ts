import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackFragmentComponent} from './stack-fragment.component';

describe('StackFragmentComponent', () => {
  let component: StackFragmentComponent;
  let fixture: ComponentFixture<StackFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
