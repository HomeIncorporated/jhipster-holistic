import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TaskMySuffix } from 'app/shared/model/task-my-suffix.model';
import { TaskMySuffixService } from './task-my-suffix.service';
import { TaskMySuffixComponent } from './task-my-suffix.component';
import { TaskMySuffixDetailComponent } from './task-my-suffix-detail.component';
import { TaskMySuffixUpdateComponent } from './task-my-suffix-update.component';
import { TaskMySuffixDeletePopupComponent } from './task-my-suffix-delete-dialog.component';
import { ITaskMySuffix } from 'app/shared/model/task-my-suffix.model';

@Injectable({ providedIn: 'root' })
export class TaskMySuffixResolve implements Resolve<ITaskMySuffix> {
  constructor(private service: TaskMySuffixService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ITaskMySuffix> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<TaskMySuffix>) => response.ok),
        map((task: HttpResponse<TaskMySuffix>) => task.body)
      );
    }
    return of(new TaskMySuffix());
  }
}

export const taskRoute: Routes = [
  {
    path: '',
    component: TaskMySuffixComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.task.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: TaskMySuffixDetailComponent,
    resolve: {
      task: TaskMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.task.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: TaskMySuffixUpdateComponent,
    resolve: {
      task: TaskMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.task.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: TaskMySuffixUpdateComponent,
    resolve: {
      task: TaskMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.task.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const taskPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: TaskMySuffixDeletePopupComponent,
    resolve: {
      task: TaskMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.task.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
