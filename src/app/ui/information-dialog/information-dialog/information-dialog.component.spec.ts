
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationDialogComponent} from './information-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {InformationDialogDeclarations} from '../information-dialog.declarations';
import {InformationDialogImports} from '../information-dialog.imports';

xdescribe('WikipediaDialogComponent', () => {
  let component: InformationDialogComponent;
  let fixture: ComponentFixture<InformationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformationDialogDeclarations],
      imports: [InformationDialogImports],
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
    fixture = TestBed.createComponent(InformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
