import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Seat } from "../models/seat";
import { SeatsService } from "../services/seats.service";

export class SeatsDataSource implements DataSource<Seat> 
{
    private seatsSubject = new BehaviorSubject<Seat[]>([]);
    private seatsTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private seatsService: SeatsService) {}

    get seats$()
    {
        return this.seatsSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.seatsTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Seat[]> 
    {
        return this.seatsSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.seatsSubject.complete();
        this.loadingSubject.complete();
        this.seatsTotalRecordsSubject.complete();
    }

    getSeats(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.seatsService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.seatsTotalRecordsSubject.next(resp.result.totalRecord);
            this.seatsSubject.next(resp.result.data);
        });
        

    }  

}