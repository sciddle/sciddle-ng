import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StackFragmentComponent} from './stack-fragment.component';
import {StacksImports} from '../../../stacks.imports';
import {StacksDeclarations} from '../../../stacks.declarations';

describe('StackFragmentComponent', () => {
  let component: StackFragmentComponent;
  let fixture: ComponentFixture<StackFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StacksImports],
      declarations: [StacksDeclarations]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
