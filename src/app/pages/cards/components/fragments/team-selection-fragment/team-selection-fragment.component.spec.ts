import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TeamSelectionFragmentComponent} from './team-selection-fragment.component';
import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';

describe('TeamSelectionFragmentComponent', () => {
  let component: TeamSelectionFragmentComponent;
  let fixture: ComponentFixture<TeamSelectionFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSelectionFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
