import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StacksComponent} from './stacks.component';
import {StacksDeclarations} from '../../stacks.declarations';
import {StacksImports} from '../../stacks.imports';

describe('StacksComponent', () => {
  let component: StacksComponent;
  let fixture: ComponentFixture<StacksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StacksImports],
      declarations: [StacksDeclarations]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
