import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { IDepartmentMySuffix } from 'app/shared/model/department-my-suffix.model';
import { AccountService } from 'app/core/auth/account.service';
import { DepartmentMySuffixService } from './department-my-suffix.service';

@Component({
  selector: 'jhi-department-my-suffix',
  templateUrl: './department-my-suffix.component.html'
})
export class DepartmentMySuffixComponent implements OnInit, OnDestroy {
  departments: IDepartmentMySuffix[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected departmentService: DepartmentMySuffixService,
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
      this.departmentService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<IDepartmentMySuffix[]>) => res.ok),
          map((res: HttpResponse<IDepartmentMySuffix[]>) => res.body)
        )
        .subscribe((res: IDepartmentMySuffix[]) => (this.departments = res));
      return;
    }
    this.departmentService
      .query()
      .pipe(
        filter((res: HttpResponse<IDepartmentMySuffix[]>) => res.ok),
        map((res: HttpResponse<IDepartmentMySuffix[]>) => res.body)
      )
      .subscribe((res: IDepartmentMySuffix[]) => {
        this.departments = res;
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
    this.registerChangeInDepartments();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IDepartmentMySuffix) {
    return item.id;
  }

  registerChangeInDepartments() {
    this.eventSubscriber = this.eventManager.subscribe('departmentListModification', response => this.loadAll());
  }
}
