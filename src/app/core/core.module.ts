import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EntityModule} from './entity/entity.module';
import {UiModule} from './ui/ui.module';
import {NotificationModule} from './notification/notification.module';
import {PersistenceModule} from './persistence/persistence.module';
import {UtilModule} from './util/util.module';
import {WikipediaModule} from './wikipedia/wikipedia.module';

@NgModule({
  imports: [
    CommonModule,

    EntityModule,
    NotificationModule,
    PersistenceModule,
    UiModule,
    UtilModule,
    WikipediaModule
  ],
  declarations: []
})
export class CoreModule {
}
