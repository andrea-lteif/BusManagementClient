import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTableRequest } from 'src/app/shared/models/dataTableRequest';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient : HttpClient) { }

  getAllSSR(dataTableRequest : DataTableRequest){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(dataTableRequest);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/GetAllSSR`, body ,{headers : headers});
  }

  getAll(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Account/GetAll`);
  }

  getAllActive(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Account/GetAllActive`);
  }

  getById(id:string){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Account/GetById?id=` + id);
  }

  activate(form:User){
    const headers = {'content-type' : 'application/json'};
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/Activate?id=` + form.id + '&isActive=' + form.isActive, null, {headers : headers});
  }

  update(form : any){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/Update`, body,{headers : headers});
  }

  create(form:User){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Account/Create`, body,{headers : headers});
  }}
