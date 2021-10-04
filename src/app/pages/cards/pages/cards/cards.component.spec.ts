import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {STACK_PERSISTENCE_POUCHDB} from '../../../../core/entity/entity.module';
import {StacksPouchdbService} from '../../../../core/entity/services/stack/persistence/stacks-pouchdb.service';
import {CardsDeclarations} from '../../cards.declarations';
import {CardsImports} from '../../cards.imports';
import {CardsComponent} from './cards.component';

describe('CardsComponent', () => {
  let component: CardsComponent;
  let fixture: ComponentFixture<CardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CardsImports],
      declarations: [CardsDeclarations],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            params: of({id: 'mock'}),
          },
        },
        {provide: Router},
        {provide: StacksPouchdbService},
        {provide: STACK_PERSISTENCE_POUCHDB, useClass: StacksPouchdbService},
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
