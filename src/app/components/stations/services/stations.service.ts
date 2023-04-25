import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataTableRequest } from 'src/app/shared/models/dataTableRequest';
import { environment } from 'src/environments/environment';
import { Station } from '../models/station';

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  constructor(private httpClient : HttpClient) { }

  getAllSSR(dataTableRequest : DataTableRequest){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(dataTableRequest);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Station/GetAllSSR`, body ,{headers : headers});
  }

  getAll(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Station/GetAll`);
  }

  getAllActive(){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Station/GetAllActive`);
  }

  getById(id:string){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Station/GetById?id=` + id);
  }

  getByRouteId(routeid:number){
    return this.httpClient.get<any>(`${environment.apiDomainUrl}Station/GetStationByRoute?routeId=` + routeid);
  }

  activate(form:Station){
    const headers = {'content-type' : 'application/json'};
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Station/Activate?id=` + form.id + '&isActive=' + form.isActive, null, {headers : headers});
  }

  update(form : any){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Station/Update`, body,{headers : headers});
  }

  create(form:Station){
    const headers = {'content-type' : 'application/json'};
    let body=JSON.stringify(form);
    return this.httpClient.post<any>(`${environment.apiDomainUrl}Station/Create`, body,{headers : headers});
  }
}
