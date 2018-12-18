import { Category } from './../../categories/shared/category.model';
import { CategoryService } from './../../categories/shared/category.service';
import { EntryService } from './../shared/entry.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as toastr from 'toastr';
import { switchMap } from 'rxjs/operators';
import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {
  categories: Category[];

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousendsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Se', 'Sa'],
    monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    protected injector: Injector,
    protected service: EntryService,
    protected categoryService: CategoryService
  ) {
    super(injector, new Entry(), service, Entry.fromJson);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.LoadCategories();
  }

  protected LoadCategories() {
    this.categoryService.getAll().subscribe(categories => this.categories = categories);
  }

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        };
      });
  }
  protected buldResourceForm() {
    this.resourceForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }
  protected creationPageTitle(): string { return 'Cadastro de nova lançamento'; }
  protected editionPageTitle(): string {
    const resoureName = this.resource.name || '';
    return `Editando lançameto ${resoureName}`;
  }
}
