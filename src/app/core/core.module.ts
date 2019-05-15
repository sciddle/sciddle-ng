import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntityModule} from './entity/entity.module';
import {UiModule} from './ui/ui.module';
import {NotificationModule} from './notification/notification.module';
import {PersistenceModule} from './persistence/persistence.module';

@NgModule({
  imports: [
    CommonModule,

    EntityModule,
    NotificationModule,
    PersistenceModule,
    UiModule
  ],
  declarations: []
})
export class CoreModule {
}
