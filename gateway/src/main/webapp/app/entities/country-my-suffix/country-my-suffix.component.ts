import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { ICountryMySuffix } from 'app/shared/model/country-my-suffix.model';
import { AccountService } from 'app/core/auth/account.service';
import { CountryMySuffixService } from './country-my-suffix.service';

@Component({
  selector: 'jhi-country-my-suffix',
  templateUrl: './country-my-suffix.component.html'
})
export class CountryMySuffixComponent implements OnInit, OnDestroy {
  countries: ICountryMySuffix[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected countryService: CountryMySuffixService,
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
      this.countryService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ICountryMySuffix[]>) => res.ok),
          map((res: HttpResponse<ICountryMySuffix[]>) => res.body)
        )
        .subscribe((res: ICountryMySuffix[]) => (this.countries = res));
      return;
    }
    this.countryService
      .query()
      .pipe(
        filter((res: HttpResponse<ICountryMySuffix[]>) => res.ok),
        map((res: HttpResponse<ICountryMySuffix[]>) => res.body)
      )
      .subscribe((res: ICountryMySuffix[]) => {
        this.countries = res;
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
    this.registerChangeInCountries();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICountryMySuffix) {
    return item.id;
  }

  registerChangeInCountries() {
    this.eventSubscriber = this.eventManager.subscribe('countryListModification', response => this.loadAll());
  }
}
