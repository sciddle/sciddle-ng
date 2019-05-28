import { ConfirmationDialogModule } from './confirmation-dialog.module';

describe('ConfirmationFinishedDialogModule', () => {
  let confirmationDialogModule: ConfirmationDialogModule;

  beforeEach(() => {
    confirmationDialogModule = new ConfirmationDialogModule();
  });

  it('should create an instance', () => {
    expect(confirmationDialogModule).toBeTruthy();
  });
});
