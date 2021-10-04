import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';
import {ScoreOverviewFragmentComponent} from './score-overview-fragment.component';

describe('ScoreOverviewFragmentComponent', () => {
  let component: ScoreOverviewFragmentComponent;
  let fixture: ComponentFixture<ScoreOverviewFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreOverviewFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
