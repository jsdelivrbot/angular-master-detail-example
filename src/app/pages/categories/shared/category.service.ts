import { Injectable, Injector } from "@angular/core";
import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Category } from "./category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Category> {

  constructor(protected injector: Injector){
    super(injector, 'api/categories', Category.fromJson.bind(Category));
  }

}