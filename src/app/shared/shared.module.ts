import { NgModule } from '@angular/core';

// shared modules
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  declarations: [
    BreadCrumbComponent,
    PageHeaderComponent
  ],
  exports: [
    // shared modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,

    // shared components
    BreadCrumbComponent,
    PageHeaderComponent
  ]
})
export class SharedModule { }
