import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTableRequest } from 'src/app/shared/models/dataTableRequest';
import { environment } from 'src/environments/environment';
import { Ticket } from '../models/ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(private httpClient : HttpClient) { }

  getAllSSR(dataTableRequest : DataTableRequest){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(dataTableRequest);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Ticket/GetAllSSR`, body ,{headers : headers});
  }

  getAll(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Ticket/GetAll`);
  }

  getAllActive(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Ticket/GetAllActive`);
  }

  getById(id:string){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Ticket/GetById?id=` + id);
  }

  getByUserId(dataTableRequest : DataTableRequest, userId: string){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(dataTableRequest);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Ticket/GetByUserId?userId=`+ userId, body ,{headers : headers});
  }


  activate(form:Ticket){
    const headers = {'content-type' : 'application/json'};
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Ticket/Activate?id=` + form.id + '&isActive=' + form.isActive, null, {headers : headers});
  }

  getTicketPrice(form : any){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Ticket/GetTicketPrice`, body,{headers : headers});
  }

  update(form : any){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Ticket/Update`, body,{headers : headers});
  }

  create(form:Ticket){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Ticket/Create`, body,{headers : headers});
  }}
