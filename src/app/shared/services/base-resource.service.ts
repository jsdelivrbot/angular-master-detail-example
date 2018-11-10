// angular
import { HttpClient } from "@angular/common/http";
import { Injector } from "@angular/core";

// rxjs
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseResourceModel } from "../models/base-resource.model";


export abstract class BaseResourceService<T extends BaseResourceModel> {

  protected http: HttpClient;

  public constructor(
    protected injector: Injector, 
    protected apiPath: string,
    protected jsonDataToResourceFn: (jsonData) => T
  ){
    this.http = this.injector.get(HttpClient)
  }


  // ==================================================
  // == PUBLIC METHODS
  // ==================================================

  getAll(): Observable<T[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResources.bind(this))
    );
  }

  getById(id: number): Observable<T> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource.bind(this))
    );
  }

  create(resource: T): Observable<T> {
    return this.http.post(this.apiPath, resource).pipe(
      catchError(this.handleError),
      map(this.jsonDataToResource.bind(this))
    );
  }

  update(resource: T): Observable<T> {
    const url = `${this.apiPath}/${resource.id}`;

    return this.http.put(url, resource).pipe(
      catchError(this.handleError),
      map(() => resource)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }



  // ==================================================
  // PROTECTED METHODS
  // ==================================================  

  protected jsonDataToResources(jsonData: any[]): T[] {
    const resources: T[] = [];
    jsonData.forEach(
      jsonElement => resources.push( this.jsonDataToResourceFn(jsonElement) )
    );
    return resources;
  }

  protected jsonDataToResource(jsonData: any): T {
    return this.jsonDataToResourceFn(jsonData);
  }


  protected handleError(error): Observable<any> {
    console.log("ERRO NA REQUISICAO => ", error);
    return throwError(error);
  }
}
