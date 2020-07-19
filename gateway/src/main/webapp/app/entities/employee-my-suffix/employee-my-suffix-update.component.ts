import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IEmployeeMySuffix, EmployeeMySuffix } from 'app/shared/model/employee-my-suffix.model';
import { EmployeeMySuffixService } from './employee-my-suffix.service';
import { IDepartmentMySuffix } from 'app/shared/model/department-my-suffix.model';
import { DepartmentMySuffixService } from 'app/entities/department-my-suffix/department-my-suffix.service';

@Component({
  selector: 'jhi-employee-my-suffix-update',
  templateUrl: './employee-my-suffix-update.component.html'
})
export class EmployeeMySuffixUpdateComponent implements OnInit {
  isSaving: boolean;

  departments: IDepartmentMySuffix[];

  employees: IEmployeeMySuffix[];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    hireDate: [],
    salary: [],
    commissionPct: [],
    department: [],
    manager: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected employeeService: EmployeeMySuffixService,
    protected departmentService: DepartmentMySuffixService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ employee }) => {
      this.updateForm(employee);
    });
    this.departmentService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IDepartmentMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IDepartmentMySuffix[]>) => response.body)
      )
      .subscribe((res: IDepartmentMySuffix[]) => (this.departments = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.employeeService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IEmployeeMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<IEmployeeMySuffix[]>) => response.body)
      )
      .subscribe((res: IEmployeeMySuffix[]) => (this.employees = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(employee: IEmployeeMySuffix) {
    this.editForm.patchValue({
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      hireDate: employee.hireDate != null ? employee.hireDate.format(DATE_TIME_FORMAT) : null,
      salary: employee.salary,
      commissionPct: employee.commissionPct,
      department: employee.department,
      manager: employee.manager
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const employee = this.createFromForm();
    if (employee.id !== undefined) {
      this.subscribeToSaveResponse(this.employeeService.update(employee));
    } else {
      this.subscribeToSaveResponse(this.employeeService.create(employee));
    }
  }

  private createFromForm(): IEmployeeMySuffix {
    return {
      ...new EmployeeMySuffix(),
      id: this.editForm.get(['id']).value,
      firstName: this.editForm.get(['firstName']).value,
      lastName: this.editForm.get(['lastName']).value,
      email: this.editForm.get(['email']).value,
      phoneNumber: this.editForm.get(['phoneNumber']).value,
      hireDate: this.editForm.get(['hireDate']).value != null ? moment(this.editForm.get(['hireDate']).value, DATE_TIME_FORMAT) : undefined,
      salary: this.editForm.get(['salary']).value,
      commissionPct: this.editForm.get(['commissionPct']).value,
      department: this.editForm.get(['department']).value,
      manager: this.editForm.get(['manager']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmployeeMySuffix>>) {
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

  trackDepartmentById(index: number, item: IDepartmentMySuffix) {
    return item.id;
  }

  trackEmployeeById(index: number, item: IEmployeeMySuffix) {
    return item.id;
  }
}
