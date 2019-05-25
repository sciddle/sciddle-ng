import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GamesToolbarComponent} from './games-toolbar.component';

describe('GamesToolbarComponent', () => {
  let component: GamesToolbarComponent;
  let fixture: ComponentFixture<GamesToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GamesToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
