import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { CategoryService } from './../shared/category.service';
import { Category } from './../shared/category.model';
import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(
    protected injector: Injector,
    service: CategoryService
  ) {
    super(injector, new Category(), service, Category.fromJson);
  }

  protected buldResourceForm(): void {
    this.resourceForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  protected creationPageTitle(): string { return 'Cadastro de nova categoria'; }
  protected editionPageTitle(): string {
    const resoureName = this.resource.name || '';
    return `Editando categoria ${resoureName}`;
  }
}
