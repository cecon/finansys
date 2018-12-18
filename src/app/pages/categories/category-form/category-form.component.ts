import { CategoryService } from './../shared/category.service';
import { Category } from './../shared/category.model';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as toastr from 'toastr';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[] = null;
  submittingForm = false;
  category: Category = new Category();
  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buldCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  private setCurrentAction() {
    const r = this.route.snapshot.url[1] || { path: null };
    if (r.path === 'edit') {
      this.currentAction = 'edit';
    } else {
      this.currentAction = 'new';
    }
  }
  private buldCategoryForm() {
    this.categoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }
  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(category => {
        this.category = category;
        this.categoryForm.patchValue(this.category);
      },
        () => {
          alert('Ocorreu um erro no servidor');
        });
    }
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }
  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de nova categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = `Editando a categoria: ${categoryName}`;
    }
  }

  private createCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      cat => this.actionsForSuccess(cat),
      error => this.actionsForError(error)
    );

  }

  private updateCategory() {
    const category = Object.assign(new Category(), this.categoryForm.value);
    console.log(category);
    this.categoryService.update(category).subscribe(
      cat => this.actionsForSuccess(cat),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(category: Category) {
    toastr.success('Solicitação processada com sucesso');
    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
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
