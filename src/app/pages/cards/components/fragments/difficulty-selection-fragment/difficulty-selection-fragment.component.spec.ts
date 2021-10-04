import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';
import {DifficultySelectionFragmentComponent} from './difficulty-selection-fragment.component';

describe('DifficultySelectionFragmentComponent', () => {
  let component: DifficultySelectionFragmentComponent;
  let fixture: ComponentFixture<DifficultySelectionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifficultySelectionFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
