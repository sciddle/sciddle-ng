import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';
import {CardFragmentComponent} from './card-fragment.component';

describe('CardFragmentComponent', () => {
  let component: CardFragmentComponent;
  let fixture: ComponentFixture<CardFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
