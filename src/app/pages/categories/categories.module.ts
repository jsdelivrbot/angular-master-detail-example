import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoriesRoutingModule
  ],
  declarations: [CategoryListComponent, CategoryFormComponent]
})
export class CategoriesModule { }
