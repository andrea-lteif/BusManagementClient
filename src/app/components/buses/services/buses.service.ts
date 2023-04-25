import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTableRequest } from 'src/app/shared/models/dataTableRequest';
import { environment } from 'src/environments/environment';
import { Bus } from '../models/bus';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  constructor(private httpClient : HttpClient) { }

  getAllSSR(dataTableRequest : DataTableRequest){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(dataTableRequest);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Bus/GetAllSSR`, body ,{headers : headers});
  }

  getAll(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Bus/GetAll`);
  }

  getAllActive(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Bus/GetAllActive`);
  }

  getById(id:string){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Bus/GetById?id=` + id);
  }

  activate(form:Bus){
    const headers = {'content-type' : 'application/json'};
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Bus/Activate?id=` + form.id + '&isActive=' + form.isActive, null, {headers : headers});
  }

  update(form : any){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Bus/Update`, body,{headers : headers});
  }

  create(form:Bus){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Bus/Create`, body,{headers : headers});
  }
}
