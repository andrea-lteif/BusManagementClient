import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "./authentication/page404/page404.component";
import { AuthGuard } from "./core/guards/auth.guard";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/auth/login", pathMatch: "full" },
      {
        path: "bus-types",
        loadChildren: () =>
          import("./components/bus-types/bus-types.module").then(
            (m) => m.BusTypesModule
          ),
      },
      {
        path: "buses",
        loadChildren: () =>
          import("./components/buses/buses.module").then(
            (m) => m.BusesModule
          ),
      },
      {
        path: "routes",
        loadChildren: () =>
          import("./components/routes/routes.module").then(
            (m) => m.RoutesModule
          ),
      },
      {
        path: "seats",
        loadChildren: () =>
          import("./components/seats/seats.module").then(
            (m) => m.SeatsModule
          ),
      },
      {
        path: "stations",
        loadChildren: () =>
          import("./components/stations/stations.module").then(
            (m) => m.StationsModule
          ),
      },
      {
        path: "trips",
        loadChildren: () =>
          import("./components/trips/trips.module").then(
            (m) => m.TripsModule
          ),
      },{
        path: "tickets",
        loadChildren: () =>
          import("./components/tickets/tickets.module").then(
            (m) => m.TicketsModule
          ),
      },{
        path: "payments",
        loadChildren: () =>
          import("./components/payments/payments.module").then(
            (m) => m.PaymentsModule
          ),
      },
      {
        path: "users",
        loadChildren: () =>
          import("./components/users/users.module").then(
            (m) => m.UsersModule
          ),
      },
      {
        path: "schedules",
        loadChildren: () =>
          import("./components/schedules/schedules.module").then(
            (m) => m.SchedulesModule
          ),
      },
      {
        path: "purchased-tickets",
        loadChildren: () =>
          import("./components/schedules/schedules.module").then(
            (m) => m.SchedulesModule
          ),
      }
    ],
  },
  {
    path: "auth",
    component: AuthLayoutComponent,
    loadChildren: () =>
      import("./auth/auth.module").then(
        (m) => m.AuthModule
      ),
  },
  { path: "**", component: Page404Component },
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
