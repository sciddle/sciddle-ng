import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InformationDialogDeclarations} from '../information-dialog.declarations';
import {InformationDialogImports} from '../information-dialog.imports';
import {CheckableInformationDialogComponent} from './checkable-information-dialog.component';

describe('WikipediaDialogComponent', () => {
  let component: CheckableInformationDialogComponent;
  let fixture: ComponentFixture<CheckableInformationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformationDialogDeclarations],
      imports: [InformationDialogImports],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: {}}, {
          provide: MatDialogRef, useValue: {
            close: jasmine.createSpy('close'),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckableInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
