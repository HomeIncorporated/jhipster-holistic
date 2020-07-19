import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { filter, map } from 'rxjs/operators';
import { JhiEventManager } from 'ng-jhipster';

import { ITaskMySuffix } from 'app/shared/model/task-my-suffix.model';
import { AccountService } from 'app/core/auth/account.service';
import { TaskMySuffixService } from './task-my-suffix.service';

@Component({
  selector: 'jhi-task-my-suffix',
  templateUrl: './task-my-suffix.component.html'
})
export class TaskMySuffixComponent implements OnInit, OnDestroy {
  tasks: ITaskMySuffix[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected taskService: TaskMySuffixService,
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
      this.taskService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ITaskMySuffix[]>) => res.ok),
          map((res: HttpResponse<ITaskMySuffix[]>) => res.body)
        )
        .subscribe((res: ITaskMySuffix[]) => (this.tasks = res));
      return;
    }
    this.taskService
      .query()
      .pipe(
        filter((res: HttpResponse<ITaskMySuffix[]>) => res.ok),
        map((res: HttpResponse<ITaskMySuffix[]>) => res.body)
      )
      .subscribe((res: ITaskMySuffix[]) => {
        this.tasks = res;
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
    this.registerChangeInTasks();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ITaskMySuffix) {
    return item.id;
  }

  registerChangeInTasks() {
    this.eventSubscriber = this.eventManager.subscribe('taskListModification', response => this.loadAll());
  }
}
