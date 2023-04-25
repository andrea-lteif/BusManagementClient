import { NgModule } from "@angular/core";

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./layout/header/header.component";
import { PageLoaderComponent } from "./layout/page-loader/page-loader.component";
import { SidebarComponent } from "./layout/sidebar/sidebar.component";
import { RightSidebarComponent } from "./layout/right-sidebar/right-sidebar.component";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { fakeBackendProvider } from "./core/interceptor/fake-backend";
import { ErrorInterceptor } from "./core/interceptor/error.interceptor";
import { JwtInterceptor } from "./core/interceptor/jwt.interceptor";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ClickOutsideModule } from "ng-click-outside";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";

import { LoadingBarRouterModule } from "@ngx-loading-bar/router";
import { NgScrollbarModule } from "ngx-scrollbar";
import { BusTypesComponent } from "./components/bus-types/bus-types/bus-types.component";
import { ComponentsModule } from "./shared/components/components.module";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        PageLoaderComponent,
        SidebarComponent,
        RightSidebarComponent,
        AuthLayoutComponent,
        MainLayoutComponent,
        BusTypesComponent,
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        fakeBackendProvider,
        MatSnackBar,
        NgxMatDatetimePickerModule
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        ClickOutsideModule,
        LoadingBarRouterModule,
        NgScrollbarModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        // core & shared
        CoreModule,
        SharedModule,
        ComponentsModule,
        MatSortModule,
        MatPaginatorModule,
        MatDialogModule,
        NgxMatNativeDateModule, 
        MatFormFieldModule,
        MatInputModule,
    ]
})
export class AppModule {}
