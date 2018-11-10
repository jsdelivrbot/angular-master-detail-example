import { Injectable, Injector } from "@angular/core";
import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Entry } from "./entry.model";


import { Observable } from "rxjs";
import { flatMap, map } from "rxjs/operators";

import { CategoryService } from "../../categories/shared/category.service";

import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {
  
  constructor(protected injector: Injector, private categoryService: CategoryService){
    super(injector, 'api/entries', Entry.fromJson.bind(Entry));
  }


  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry)
      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    )
  }


  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }


  // PRIVATE METHODS

  private filterByMonthAndYear(entries, month, year): Entry[] {
    return entries.filter(entry => {
      let entryDate = moment(entry.date, "DD/MM/YYYY");
      let monthMatches = entryDate.month() + 1 == month;
      let yearMatches = entryDate.year() == year;      
      
      if (monthMatches && yearMatches) return entry;
    })
  }
}