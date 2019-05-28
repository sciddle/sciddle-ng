import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GamesComponent} from './games.component';
import {GamesDeclarations} from '../../games.declarations';
import {GamesImports} from '../../games.imports';

describe('GamesComponent', () => {
  let component: GamesComponent;
  let fixture: ComponentFixture<GamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GamesImports],
      declarations: [GamesDeclarations]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
