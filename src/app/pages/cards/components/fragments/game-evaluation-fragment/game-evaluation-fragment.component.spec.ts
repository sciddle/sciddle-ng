import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GameEvaluationFragmentComponent} from './game-evaluation-fragment.component';
import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';

describe('GameEvaluationFragmentComponent', () => {
  let component: GameEvaluationFragmentComponent;
  let fixture: ComponentFixture<GameEvaluationFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameEvaluationFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
