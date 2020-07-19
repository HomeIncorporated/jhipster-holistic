import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { ILocationMySuffix } from 'app/shared/model/location-my-suffix.model';
import { AccountService } from 'app/core/auth/account.service';
import { LocationMySuffixService } from './location-my-suffix.service';

@Component({
  selector: 'jhi-location-my-suffix',
  templateUrl: './location-my-suffix.component.html'
})
export class LocationMySuffixComponent implements OnInit, OnDestroy {
  locations: ILocationMySuffix[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected locationService: LocationMySuffixService,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.locationService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ILocationMySuffix[]>) => res.ok),
          map((res: HttpResponse<ILocationMySuffix[]>) => res.body)
        )
        .subscribe((res: ILocationMySuffix[]) => (this.locations = res));
      return;
    }
    this.locationService
      .query()
      .pipe(
        filter((res: HttpResponse<ILocationMySuffix[]>) => res.ok),
        map((res: HttpResponse<ILocationMySuffix[]>) => res.body)
      )
      .subscribe((res: ILocationMySuffix[]) => {
        this.locations = res;
        this.currentSearch = '';
      });
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().subscribe(account => {
      this.currentAccount = account;
    });
    this.registerChangeInLocations();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ILocationMySuffix) {
    return item.id;
  }

  registerChangeInLocations() {
    this.eventSubscriber = this.eventManager.subscribe('locationListModification', response => this.loadAll());
  }
}
