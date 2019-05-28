import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AboutDialogComponent} from './about-dialog.component';
import {AboutDialogImports} from '../about-dialog.imports';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AboutDialogDeclarations} from '../about-dialog.declarations';

describe('AboutDialogComponent', () => {
  let component: AboutDialogComponent;
  let fixture: ComponentFixture<AboutDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutDialogDeclarations],
      imports: [AboutDialogImports],
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
    fixture = TestBed.createComponent(AboutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
