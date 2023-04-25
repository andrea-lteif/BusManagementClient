import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Route } from "../models/route";
import { RoutesService } from "../services/routes.service";

export class RoutesDataSource implements DataSource<Route> 
{
    private routesSubject = new BehaviorSubject<Route[]>([]);
    private routesTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private routesService: RoutesService) {}

    get routes$()
    {
        return this.routesSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.routesTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Route[]> 
    {
        return this.routesSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.routesSubject.complete();
        this.loadingSubject.complete();
        this.routesTotalRecordsSubject.complete();
    }

    getRoutes(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.routesService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.routesTotalRecordsSubject.next(resp.result.totalRecord);
            this.routesSubject.next(resp.result.data);
        });
        

    }  

}