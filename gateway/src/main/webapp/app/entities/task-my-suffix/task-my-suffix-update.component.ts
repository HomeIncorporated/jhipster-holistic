import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ITaskMySuffix, TaskMySuffix } from 'app/shared/model/task-my-suffix.model';
import { TaskMySuffixService } from './task-my-suffix.service';
import { IJobMySuffix } from 'app/shared/model/job-my-suffix.model';
import { JobMySuffixService } from 'app/entities/job-my-suffix/job-my-suffix.service';

@Component({
  selector: 'jhi-task-my-suffix-update',
  templateUrl: './task-my-suffix-update.component.html'
})
export class TaskMySuffixUpdateComponent implements OnInit {
  isSaving: boolean;

  jobs: IJobMySuffix[];

  editForm = this.fb.group({
    id: [],
    title: [],
    description: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected taskService: TaskMySuffixService,
    protected jobService: JobMySuffixService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ task }) => {
      this.updateForm(task);
    });
    this.jobService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IJobMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IJobMySuffix[]>) => response.body)
      )
      .subscribe((res: IJobMySuffix[]) => (this.jobs = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(task: ITaskMySuffix) {
    this.editForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const task = this.createFromForm();
    if (task.id !== undefined) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  private createFromForm(): ITaskMySuffix {
    return {
      ...new TaskMySuffix(),
      id: this.editForm.get(['id']).value,
      title: this.editForm.get(['title']).value,
      description: this.editForm.get(['description']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITaskMySuffix>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackJobById(index: number, item: IJobMySuffix) {
    return item.id;
  }

  getSelected(selectedVals: any[], option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
