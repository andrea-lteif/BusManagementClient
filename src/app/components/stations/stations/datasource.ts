import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { Station } from "../models/station";
import { StationsService } from "../services/stations.service";

export class StationsDataSource implements DataSource<Station> 
{
    private stationsSubject = new BehaviorSubject<Station[]>([]);
    private stationsTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private stationsService: StationsService) {}

    get stations$()
    {
        return this.stationsSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.stationsTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<Station[]> 
    {
        return this.stationsSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.stationsSubject.complete();
        this.loadingSubject.complete();
        this.stationsTotalRecordsSubject.complete();
    }

    getStations(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.stationsService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.stationsTotalRecordsSubject.next(resp.result.totalRecord);
            this.stationsSubject.next(resp.result.data);
        });
        

    }  

}