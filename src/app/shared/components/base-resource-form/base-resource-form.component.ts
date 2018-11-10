import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";

import { switchMap } from "rxjs/operators";

import { BaseResourceService } from "../../services/base-resource.service";
import { BaseResourceModel } from "../../models/base-resource.model";

import * as toastr from "toastr";



export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked{

  public currentAction: string;
  public resourceForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: Array<string> = null;
  public submittingForm: boolean = false;

  
  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;


  public constructor(
    protected injector: Injector,
    protected resourceService: BaseResourceService<T>,
    public resource: T,
    protected jsonDataToResourceFn: (camelizedJSON) => T
  ){
    this.route = this.injector.get(ActivatedRoute)
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }


  public ngOnInit(){
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();    
  }


  public ngAfterContentChecked(){
    this.setPageTitle();
  }


  public submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.create();
    else // currentAction == 'edit'
      this.update();
  }



  // PROTECTED METHODS
  
  protected setCurrentAction(){
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }


  protected loadResource(){
    if (this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap( params => this.resourceService.getById(+params.get('id')) )
      )
      .subscribe( 
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(this.resource); // binds loaded resource
        },
        (error) => alert("Ocorreu um no servidor, tente mais tarde.")
      );

    }
  }

  
  protected setPageTitle(){
    if(this.currentAction == 'new')
      this.pageTitle = this.creationPageTitle();
    else
      this.pageTitle = this.editionPageTitle();
  }


  protected creationPageTitle(): string {
    return 'Novo';
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }


  protected create(){
    const resource = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource)
      .subscribe(
        (resource) => this.actionsForSuccess(resource),
        (error) => this.actionsForError(error)
      );
  }


  protected update(){
    let resource = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource)
      .subscribe(
        (resource) => this.actionsForSuccess(resource),
        (error) => this.actionsForError(error)
      );
  }


  protected actionsForSuccess(resource: T){
    toastr.success("Solicitação processada com sucesso!")

    let baseComponentPath = this.route.snapshot.parent.url.toString();

    // redirect/reload component page
    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    );
  }


  protected actionsForError(error){
    toastr.error("Ocorreu um erro ao processar sua solicitação!")

    this.submittingForm = false;
    
    if( error.status === 422 )
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
  }


  protected abstract buildResourceForm(): void;
}