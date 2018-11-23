import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{ errorMessage }}
    </p>
  `,
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent implements OnInit {
  
  @Input('form-control') public formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }



  public get errorMessage(): string | null {
    if( this.shouldShowErrorMessage() )
      return this.getErrorMessage();
    else
      return null;
  }



  // private methods

  private shouldShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
    // return this.formControl.invalid && ( this.formControl.touched || this.formControl.dirty );
  }

  private getErrorMessage(): string | null {
    if( this.formControl.errors.required )
      return this.requiredErrorMessage();

    else if( this.formControl.errors.minlength )
      return this.minLengthErrorMessage();

    else if( this.formControl.errors.maxlength )
      return this.maxLengthErrorMessage();

    else if( this.formControl.errors.email )
      return this.emailErrorMessage();

    else if( this.formControl.errors.mismatch )
      return this.mismatchErrorMessage();
  }

  
  
  // messages

  private requiredErrorMessage(): string {
    return 'dado obrigatório'
  }


  private minLengthErrorMessage(): string {
    let requiredLength = this.formControl.errors.minlength.requiredLength;
    return `deve ter no mínimo ${requiredLength} caracteres`;
  }


  private maxLengthErrorMessage(): string {
    let requiredLength = this.formControl.errors.maxlength.requiredLength;
    return `deve ter no máximo ${requiredLength} caracteres`;
  }


  private emailErrorMessage(): string {
    return 'formato de email inválido';
  }


  private mismatchErrorMessage(): string {
    return 'deve ser igual';
  }


}
