import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Trip } from "../models/trip";
import { TripsService } from "../services/trips.service";

export class TripsDataSource implements DataSource<Trip> 
{
    private tripsSubject = new BehaviorSubject<Trip[]>([]);
    private tripsTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private tripsService: TripsService) {}

    get trips$()
    {
        return this.tripsSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.tripsTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Trip[]> 
    {
        return this.tripsSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.tripsSubject.complete();
        this.loadingSubject.complete();
        this.tripsTotalRecordsSubject.complete();
    }

    getTrips(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.tripsService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.tripsTotalRecordsSubject.next(resp.result.totalRecord);
            this.tripsSubject.next(resp.result.data);
        });
        

    }  

}