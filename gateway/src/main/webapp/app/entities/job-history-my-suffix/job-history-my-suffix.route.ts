import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JobHistoryMySuffix } from 'app/shared/model/job-history-my-suffix.model';
import { JobHistoryMySuffixService } from './job-history-my-suffix.service';
import { JobHistoryMySuffixComponent } from './job-history-my-suffix.component';
import { JobHistoryMySuffixDetailComponent } from './job-history-my-suffix-detail.component';
import { JobHistoryMySuffixUpdateComponent } from './job-history-my-suffix-update.component';
import { JobHistoryMySuffixDeletePopupComponent } from './job-history-my-suffix-delete-dialog.component';
import { IJobHistoryMySuffix } from 'app/shared/model/job-history-my-suffix.model';

@Injectable({ providedIn: 'root' })
export class JobHistoryMySuffixResolve implements Resolve<IJobHistoryMySuffix> {
  constructor(private service: JobHistoryMySuffixService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IJobHistoryMySuffix> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<JobHistoryMySuffix>) => response.ok),
        map((jobHistory: HttpResponse<JobHistoryMySuffix>) => jobHistory.body)
      );
    }
    return of(new JobHistoryMySuffix());
  }
}

export const jobHistoryRoute: Routes = [
  {
    path: '',
    component: JobHistoryMySuffixComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.jobHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: JobHistoryMySuffixDetailComponent,
    resolve: {
      jobHistory: JobHistoryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.jobHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: JobHistoryMySuffixUpdateComponent,
    resolve: {
      jobHistory: JobHistoryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.jobHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: JobHistoryMySuffixUpdateComponent,
    resolve: {
      jobHistory: JobHistoryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.jobHistory.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const jobHistoryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: JobHistoryMySuffixDeletePopupComponent,
    resolve: {
      jobHistory: JobHistoryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.jobHistory.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
