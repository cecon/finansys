import { Category } from './../shared/category.model';
import { Component, OnInit } from '@angular/core';

import { CategoryService } from './../shared/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];
  constructor(private service: CategoryService) { }

  ngOnInit() {
    this.service.getAll().subscribe(
      categories => this.categories = categories,
      () => alert('Error ao carregar lista')
    );
  }

  delete(category) {
    this.service.delete(category).subscribe(
      () => this.categories = this.categories.filter(element => element !== category),
      () => alert('Falha excluindo categoria')
    );
  }
}
