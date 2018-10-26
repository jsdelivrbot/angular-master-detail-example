import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from "./reports/reports.component";

import { ChartModule } from "primeng/chart";


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    ChartModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
