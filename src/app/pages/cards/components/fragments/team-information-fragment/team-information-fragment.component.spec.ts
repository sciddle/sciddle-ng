import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CardsDeclarations} from '../../../cards.declarations';
import {CardsImports} from '../../../cards.imports';
import {TeamInformationFragmentComponent} from './team-information-fragment.component';

describe('TeamInformationFragmentComponent', () => {
  let component: TeamInformationFragmentComponent;
  let fixture: ComponentFixture<TeamInformationFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardsDeclarations],
      imports: [CardsImports],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInformationFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
