import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { BusType } from "../models/busType";
import { BusTypesService } from "../services/bus-types.service";

export class BusTypesDataSource implements DataSource<BusType> 
{
    private busTypesSubject = new BehaviorSubject<BusType[]>([]);
    private busTypesTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private busTypesService: BusTypesService) {}

    get busTypes$()
    {
        return this.busTypesSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.busTypesTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<BusType[]> 
    {
        return this.busTypesSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.busTypesSubject.complete();
        this.loadingSubject.complete();
        this.busTypesTotalRecordsSubject.complete();
    }

    getBusTypes(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.busTypesService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.busTypesTotalRecordsSubject.next(resp.result.totalRecord);
            this.busTypesSubject.next(resp.result.data);
        });
        

    }  

}