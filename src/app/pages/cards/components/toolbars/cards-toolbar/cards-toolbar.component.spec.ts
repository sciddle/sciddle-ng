import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsToolbarComponent} from './cards-toolbar.component';

describe('CardsToolbarComponent', () => {
  let component: CardsToolbarComponent;
  let fixture: ComponentFixture<CardsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
