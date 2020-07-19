import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { IRegionMySuffix } from 'app/shared/model/region-my-suffix.model';
import { AccountService } from 'app/core/auth/account.service';
import { RegionMySuffixService } from './region-my-suffix.service';

@Component({
  selector: 'jhi-region-my-suffix',
  templateUrl: './region-my-suffix.component.html'
})
export class RegionMySuffixComponent implements OnInit, OnDestroy {
  regions: IRegionMySuffix[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected regionService: RegionMySuffixService,
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
      this.regionService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<IRegionMySuffix[]>) => res.ok),
          map((res: HttpResponse<IRegionMySuffix[]>) => res.body)
        )
        .subscribe((res: IRegionMySuffix[]) => (this.regions = res));
      return;
    }
    this.regionService
      .query()
      .pipe(
        filter((res: HttpResponse<IRegionMySuffix[]>) => res.ok),
        map((res: HttpResponse<IRegionMySuffix[]>) => res.body)
      )
      .subscribe((res: IRegionMySuffix[]) => {
        this.regions = res;
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
    this.registerChangeInRegions();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IRegionMySuffix) {
    return item.id;
  }

  registerChangeInRegions() {
    this.eventSubscriber = this.eventManager.subscribe('regionListModification', response => this.loadAll());
  }
}
