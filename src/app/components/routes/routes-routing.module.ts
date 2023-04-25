import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesComponent } from './routes/routes.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HasRoleGuard } from 'src/app/core/guards/has-role.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'routes',
        component: RoutesComponent,
        canActivate: [AuthGuard, HasRoleGuard],
        data: {
          claim: 'Admin'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoutesRoutingModule { }
