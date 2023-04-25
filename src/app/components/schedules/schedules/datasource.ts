import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Schedule } from "../models/schedule";
import { TripsService } from "../../trips/services/trips.service";

export class SchedulesDataSource implements DataSource<Schedule> 
{
    private schedulesSubject = new BehaviorSubject<Schedule[]>([]);
    private schedulesTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private tripsService: TripsService) {}

    get schedules$()
    {
        return this.schedulesSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.schedulesTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Schedule[]> 
    {
        return this.schedulesSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.schedulesSubject.complete();
        this.loadingSubject.complete();
        this.schedulesTotalRecordsSubject.complete();
    }

    getSchedules(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.tripsService.getSchedulesSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.schedulesTotalRecordsSubject.next(resp.result.totalRecord);
            this.schedulesSubject.next(resp.result.data);
        });
    }  

}