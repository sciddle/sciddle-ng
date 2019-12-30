import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WikipediaDialogComponent} from './wikipedia-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';

/*
describe('WikipediaDialogComponent', () => {
  let component: WikipediaDialogComponent;
  let fixture: ComponentFixture<WikipediaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}}, {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikipediaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
