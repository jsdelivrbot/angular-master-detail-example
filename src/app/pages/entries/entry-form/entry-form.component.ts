import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

import { CategoryService } from "../../categories/shared/category.service";
import { Category } from "../../categories/shared/category.model";

import { switchMap } from "rxjs/operators";

import toastr from "toastr";
import currencyFormatter from "currency-formatter"

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public form: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: Array<string> = null;
  public submittingForm: boolean = false;
  public entry: Entry = new Entry();
  public categories: Category[];

  public get breadCrumbItems(): Array<any> {
    return [
      { text: 'Lançamentos', link: '/entries' },
      { text: this.pageTitle }
    ]
  }

  public ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };
   
  public imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ',',
  }


  constructor(
    private entryService: EntryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(){
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
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
  

  get typeOptions(): Array<any> {
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return  { 
          text: text, 
          value: value 
        }
      }
    );
  }



  // PRIVATE METHODS
  
  private setCurrentAction(){    
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }


  private loadEntry(){
    if (this.currentAction == 'edit'){

      this.route.paramMap.pipe(
        switchMap( params => this.entryService.getById(+params.get('id')) )
      )
      .subscribe( 
        (entry) => {
          this.entry = entry;
          this.form.patchValue(this.entry); // binds loaded resource
        },
        (error) => alert("Ocorreu um no servidor, tente mais tarde.")
      );

    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }
  
  private buildEntryForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      description: [null],
      categoryId: [null, [Validators.required]]
    });
  }

  private setPageTitle(){
    if(this.currentAction == 'new')
      this.pageTitle = this.creationPageTitle();
    else
      this.pageTitle = this.editionPageTitle();
  }


  private creationPageTitle(): string {
    return 'Cadastro de Novo Lançamento';
  }

  private editionPageTitle(): string {
    const entryName = this.entry.name || '';
    return 'Editando Lançamento: ' + entryName;
  }


  private create(){
    const entry = Object.assign(new Entry, this.form.value) as Entry;

    this.entryService.create(entry)
      .subscribe(
        (entry) => this.actionsForSuccess(entry),
        (error) => this.actionsForError(error)
      );
  }

  private update(){
    const entry = Object.assign(new Entry, this.form.value) as Entry;

    this.entryService.update(entry)
      .subscribe(
        (entry) => this.actionsForSuccess(entry),
        (error) => this.actionsForError(error)
      );
  }

  private actionsForSuccess(entry: Entry){
    toastr.success("Solicitação processada com sucesso!")

    let baseComponentPath = this.route.snapshot.parent.url.toString();

    // redirect/reload component page
    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, entry.id, 'edit'])
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
