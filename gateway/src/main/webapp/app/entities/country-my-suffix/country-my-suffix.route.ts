import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CountryMySuffix } from 'app/shared/model/country-my-suffix.model';
import { CountryMySuffixService } from './country-my-suffix.service';
import { CountryMySuffixComponent } from './country-my-suffix.component';
import { CountryMySuffixDetailComponent } from './country-my-suffix-detail.component';
import { CountryMySuffixUpdateComponent } from './country-my-suffix-update.component';
import { CountryMySuffixDeletePopupComponent } from './country-my-suffix-delete-dialog.component';
import { ICountryMySuffix } from 'app/shared/model/country-my-suffix.model';

@Injectable({ providedIn: 'root' })
export class CountryMySuffixResolve implements Resolve<ICountryMySuffix> {
  constructor(private service: CountryMySuffixService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICountryMySuffix> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CountryMySuffix>) => response.ok),
        map((country: HttpResponse<CountryMySuffix>) => country.body)
      );
    }
    return of(new CountryMySuffix());
  }
}

export const countryRoute: Routes = [
  {
    path: '',
    component: CountryMySuffixComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CountryMySuffixDetailComponent,
    resolve: {
      country: CountryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CountryMySuffixUpdateComponent,
    resolve: {
      country: CountryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CountryMySuffixUpdateComponent,
    resolve: {
      country: CountryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const countryPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CountryMySuffixDeletePopupComponent,
    resolve: {
      country: CountryMySuffixResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'gatewayApp.country.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
