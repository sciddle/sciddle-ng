import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GamesToolbarComponent} from './games-toolbar.component';
import {GamesDeclarations} from '../../../games.declarations';
import {GamesImports} from '../../../games.imports';

describe('GamesToolbarComponent', () => {
  let component: GamesToolbarComponent;
  let fixture: ComponentFixture<GamesToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GamesImports],
      declarations: [GamesDeclarations]
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
