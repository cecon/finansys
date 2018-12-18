import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntriesRoutingModule } from './entries-routing.module';

import { CalendarModule } from 'primeng/calendar';
import { IMaskModule } from 'angular-imask';

@NgModule({
  declarations: [EntryListComponent, EntryFormComponent],
  imports: [
    SharedModule,
    CalendarModule,
    IMaskModule,
    EntriesRoutingModule
  ]
})
export class EntriesModule { }
