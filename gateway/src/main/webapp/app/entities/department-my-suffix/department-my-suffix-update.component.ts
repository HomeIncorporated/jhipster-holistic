import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IDepartmentMySuffix, DepartmentMySuffix } from 'app/shared/model/department-my-suffix.model';
import { DepartmentMySuffixService } from './department-my-suffix.service';
import { ILocationMySuffix } from 'app/shared/model/location-my-suffix.model';
import { LocationMySuffixService } from 'app/entities/location-my-suffix/location-my-suffix.service';

@Component({
  selector: 'jhi-department-my-suffix-update',
  templateUrl: './department-my-suffix-update.component.html'
})
export class DepartmentMySuffixUpdateComponent implements OnInit {
  isSaving: boolean;

  locations: ILocationMySuffix[];

  editForm = this.fb.group({
    id: [],
    departmentName: [null, [Validators.required]],
    location: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected departmentService: DepartmentMySuffixService,
    protected locationService: LocationMySuffixService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ department }) => {
      this.updateForm(department);
    });
    this.locationService
      .query({ filter: 'department-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<ILocationMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<ILocationMySuffix[]>) => response.body)
      )
      .subscribe(
        (res: ILocationMySuffix[]) => {
          if (!this.editForm.get('location').value || !this.editForm.get('location').value.id) {
            this.locations = res;
          } else {
            this.locationService
              .find(this.editForm.get('location').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<ILocationMySuffix>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<ILocationMySuffix>) => subResponse.body)
              )
              .subscribe(
                (subRes: ILocationMySuffix) => (this.locations = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(department: IDepartmentMySuffix) {
    this.editForm.patchValue({
      id: department.id,
      departmentName: department.departmentName,
      location: department.location
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const department = this.createFromForm();
    if (department.id !== undefined) {
      this.subscribeToSaveResponse(this.departmentService.update(department));
    } else {
      this.subscribeToSaveResponse(this.departmentService.create(department));
    }
  }

  private createFromForm(): IDepartmentMySuffix {
    return {
      ...new DepartmentMySuffix(),
      id: this.editForm.get(['id']).value,
      departmentName: this.editForm.get(['departmentName']).value,
      location: this.editForm.get(['location']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDepartmentMySuffix>>) {
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

  trackLocationById(index: number, item: ILocationMySuffix) {
    return item.id;
  }
}
