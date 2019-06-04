import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MarkdownEditorComponent} from './markdown-editor.component';
import {MarkdownFragmentDeclarations} from '../markdown-fragment.declarations';
import {MarkdownFragmentImports} from '../markdown-fragment.imports';

describe('MarkdownEditorComponent', () => {
  let component: MarkdownEditorComponent;
  let fixture: ComponentFixture<MarkdownEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarkdownFragmentDeclarations],
      imports: [MarkdownFragmentImports],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
