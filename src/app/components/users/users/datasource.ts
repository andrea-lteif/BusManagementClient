import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { DataTableRequest } from "src/app/shared/models/dataTableRequest";
import { Filter } from "src/app/shared/models/filter";
import { User } from "../models/user";
import { UsersService } from "../services/users.service";

export class UsersDataSource implements DataSource<User> 
{
    private usersSubject = new BehaviorSubject<User[]>([]);
    private usersTotalRecordsSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);
   
    constructor(private usersService: UsersService) {}

    get users$()
    {
        return this.usersSubject.value;
    }

    get loading$()
    {
        return this.loadingSubject.value;
    }

    get totalRecords$()
    {
        return this.usersTotalRecordsSubject.value;
    }

    connect(collectionViewer: CollectionViewer): Observable<User[]> 
    {
        return this.usersSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void 
    {
        this.usersSubject.complete();
        this.loadingSubject.complete();
        this.usersTotalRecordsSubject.complete();
    }

    getUsers(filter : Filter, sortColumn : string, sortDirection: string, pageIndex: number, pageSize: number) 
    {
        this.loadingSubject.next(true);
        let datatableRequest : DataTableRequest = {
            pageIndex : pageIndex,
            pageSize : pageSize,
            sortCol : sortColumn,
            sortDirection : sortDirection,
            tableFilter : filter
        };
       
        this.usersService.getAllSSR(datatableRequest)
        .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
        .subscribe(resp => {
            this.usersTotalRecordsSubject.next(resp.result.totalRecord);
            this.usersSubject.next(resp.result.data);
        });
        

    }  

}