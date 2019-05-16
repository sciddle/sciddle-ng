import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardFragmentComponent} from './card-fragment.component';

describe('CardFragmentComponent', () => {
  let component: CardFragmentComponent;
  let fixture: ComponentFixture<CardFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardFragmentComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
