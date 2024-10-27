import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSourceDialogComponent } from './open-source-dialog.component';

describe('OpenSourceDialogComponent', () => {
  let component: OpenSourceDialogComponent;
  let fixture: ComponentFixture<OpenSourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenSourceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenSourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
