import {InformationDialogModule} from './information-dialog.module';

xdescribe('InformationDialogModule', () => {
  let informationDialogModule: InformationDialogModule;

  beforeEach(() => {
    informationDialogModule = new InformationDialogModule();
  });

  xit('should create an instance', () => {
    expect(informationDialogModule).toBeTruthy();
  });
});
