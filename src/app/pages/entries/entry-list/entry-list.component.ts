import { Entry } from './../shared/entry.model';
import { Component, OnInit } from '@angular/core';

import { EntryService } from './../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];
  constructor(private service: EntryService) { }

  ngOnInit() {
    this.service.getAll().subscribe(
      entries => this.entries = entries.sort((a, b) => b.id - a.id),
      () => alert('Error ao carregar lista')
    );
  }

  delete(entry) {
    this.service.delete(entry).subscribe(
      () => this.entries = this.entries.filter(element => element !== entry),
      () => alert('Falha excluindo categoria')
    );
  }
}
