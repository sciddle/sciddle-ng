import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EntityModule} from './entity/entity.module';
import {LanguageModule} from './language/language.module';
import {LogModule} from './log/log.module';
import {NotificationModule} from './notification/notification.module';
import {PersistenceModule} from './persistence/persistence.module';
import {UiModule} from './ui/ui.module';
import {UtilModule} from './util/util.module';
import {WikipediaModule} from './wikipedia/wikipedia.module';

@NgModule({
  imports: [
    CommonModule,

    EntityModule,
    LanguageModule,
    LogModule,
    NotificationModule,
    PersistenceModule,
    UiModule,
    UtilModule,
    WikipediaModule,
  ],
  declarations: [],
})
export class CoreModule {
}
