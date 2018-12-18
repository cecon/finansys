import { Category } from './../../categories/shared/category.model';
import { CategoryService } from './../../categories/shared/category.service';
import { EntryService } from './../shared/entry.service';
import { Entry } from './../shared/entry.model';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as toastr from 'toastr';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();
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
    private entryService: EntryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buldEntryForm();
    this.loadEntry();
    this.LoadCategories();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private LoadCategories() {
    this.categoryService.getAll().subscribe(categories => this.categories = categories);
  }

  private setCurrentAction() {
    const r = this.route.snapshot.url[1] || { path: null };
    if (r.path === 'edit') {
      this.currentAction = 'edit';
    } else {
      this.currentAction = 'new';
    }
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
  private buldEntryForm() {
    this.entryForm = this.fb.group({
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
  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe(entry => {
        this.entry = entry;
        this.entryForm.patchValue(this.entry);
      },
        () => {
          alert('Ocorreu um erro no servidor');
        });
    }
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }
  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Novo lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = `Editando a lançamento: ${entryName}`;
    }
  }

  private createEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry).subscribe(
      cat => this.actionsForSuccess(cat),
      error => this.actionsForError(error)
    );

  }

  private updateEntry() {
    const entry = Object.assign(new Entry(), this.entryForm.value);
    console.log(entry);
    this.entryService.update(entry).subscribe(
      cat => this.actionsForSuccess(cat),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success('Solicitação processada com sucesso');
    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar sua solicitação');
    if (error.status === 422) {
      this.serverErrorMessage = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessage = ['Falha na comunicação com servidores', 'Porfavor tente mais tarde'];
    }
    this.submittingForm = false;
  }
}
