import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Bus } from "../models/bus";
import { BusesService } from "../services/buses.service";

export class BusesDataSource implements DataSource<Bus> 
{
    private busesSubject = new BehaviorSubject<Bus[]>([]);
    private busesTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private busesService: BusesService) {}

    get buses$()
    {
        return this.busesSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.busesTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Bus[]> 
    {
        return this.busesSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.busesSubject.complete();
        this.loadingSubject.complete();
        this.busesTotalRecordsSubject.complete();
    }

    getBuses(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.busesService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.busesTotalRecordsSubject.next(resp.result.totalRecord);
            this.busesSubject.next(resp.result.data);
        });
    }  

}