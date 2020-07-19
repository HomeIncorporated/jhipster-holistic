import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { LocationMySuffix } from 'app/shared/model/location-my-suffix.model';
import { LocationMySuffixService } from './location-my-suffix.service';
import { LocationMySuffixComponent } from './location-my-suffix.component';
import { LocationMySuffixDetailComponent } from './location-my-suffix-detail.component';
import { LocationMySuffixUpdateComponent } from './location-my-suffix-update.component';
import { LocationMySuffixDeletePopupComponent } from './location-my-suffix-delete-dialog.component';
import { ILocationMySuffix } from 'app/shared/model/location-my-suffix.model';

@Injectable({ providedIn: 'root' })
export class LocationMySuffixResolve implements Resolve<ILocationMySuffix> {
  constructor(private service: LocationMySuffixService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ILocationMySuffix> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<LocationMySuffix>) => response.ok),
        map((location: HttpResponse<LocationMySuffix>) => location.body)
      );
    }
    return of(new LocationMySuffix());
  }
}

export const locationRoute: Routes = [
  {
    path: '',
    component: LocationMySuffixComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: LocationMySuffixDetailComponent,
    resolve: {
      location: LocationMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: LocationMySuffixUpdateComponent,
    resolve: {
      location: LocationMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: LocationMySuffixUpdateComponent,
    resolve: {
      location: LocationMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.location.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const locationPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: LocationMySuffixDeletePopupComponent,
    resolve: {
      location: LocationMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.location.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
