import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkdownPreviewComponent} from './markdown-preview.component';
import {InformationDialogDeclarations} from '../../information-dialog/information-dialog.declarations';
import {InformationDialogImports} from '../../information-dialog/information-dialog.imports';
import {MarkdownFragmentDeclarations} from '../markdown-fragment.declarations';
import {MarkdownFragmentImports} from '../markdown-fragment.imports';

describe('MarkdownPreviewComponent', () => {
  let component: MarkdownPreviewComponent;
  let fixture: ComponentFixture<MarkdownPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarkdownFragmentDeclarations],
      imports: [MarkdownFragmentImports],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
