import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTableRequest } from 'src/app/shared/models/dataTableRequest';
import { environment } from 'src/environments/environment';
import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  constructor(private httpClient : HttpClient) { }

  getAllSSR(dataTableRequest : DataTableRequest){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(dataTableRequest);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Trip/GetAllSSR`, body ,{headers : headers});
  }

  getSchedulesSSR(dataTableRequest : DataTableRequest){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(dataTableRequest);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Trip/GetSchedulesSSR`, body ,{headers : headers});
  }

  getAll(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Trip/GetAll`);
  }

  getAllActive(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Trip/GetAllActive`);
  }

  getCurrentTrips(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Trip/GetCurrentTrips`);
  }

  getById(id:string){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Trip/GetById?id=` + id);
  }

  activate(form:Trip){
    const headers = {'content-type' : 'application/json'};
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Trip/Activate?id=` + form.id + '&isActive=' + form.isActive, null, {headers : headers});
  }

  update(form : any){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Trip/Update`, body,{headers : headers});
  }

  create(form:Trip){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Trip/Create`, body,{headers : headers});
  }
}
