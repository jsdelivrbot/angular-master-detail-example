import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public form: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: Array<string> = null;
  public submittingForm: boolean = false;
  public category: Category = new Category();


  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(){
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }


  ngAfterContentChecked() {
    this.setPageTitle();
  }


  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.create();
    else // currentAction == 'edit'
      this.update();
  }



  // PRIVATE METHODS
  
  private setCurrentAction(){    
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }


  private loadCategory(){
    if (this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap( params => this.categoryService.getById(+params.get('id')) )
      )
      .subscribe( 
        (category) => {
          this.category = category;
          this.form.patchValue(this.category); // binds loaded resource
        },
        (error) => alert("Ocorreu um no servidor, tente mais tarde.")
      );

    }
  }

  private buildCategoryForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    });
  }

  private setPageTitle(){
    if(this.currentAction == 'new')
      this.pageTitle = this.creationPageTitle();
    else
      this.pageTitle = this.editionPageTitle();
  }


  private creationPageTitle(): string {
    return 'Cadastro de Nova de Categoria';
  }

  private editionPageTitle(): string {
    const categoryName = this.category.name || '';
    return 'Editando Categoria: ' + categoryName;
  }


  private create(){
    const category = Object.assign(new Category, this.form.value) as Category;

    this.categoryService.create(category)
      .subscribe(
        (category) => this.actionsForSuccess(category),
        (error) => this.actionsForError(error)
      );
  }

  private update(){
    const category = Object.assign(new Category, this.form.value) as Category;

    this.categoryService.update(category)
      .subscribe(
        (category) => this.actionsForSuccess(category),
        (error) => this.actionsForError(error)
      );
  }

  private actionsForSuccess(category: Category){
    toastr.success("Solicitação processada com sucesso!")

    let baseComponentPath = this.route.snapshot.parent.url.toString();

    // redirect/reload component page
    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, category.id, 'edit'])
    );
  }

  private actionsForError(error){
    toastr.error("Ocorreu um erro ao processar sua solicitação!")

    this.submittingForm = false;
    
    if( error.status === 422 )
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
  }


}
