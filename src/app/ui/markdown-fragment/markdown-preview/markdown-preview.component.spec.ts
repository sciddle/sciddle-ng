import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MarkdownFragmentDeclarations} from '../markdown-fragment.declarations';
import {MarkdownFragmentImports} from '../markdown-fragment.imports';
import {MarkdownPreviewComponent} from './markdown-preview.component';

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

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
