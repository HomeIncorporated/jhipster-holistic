import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEmployeeMySuffix } from 'app/shared/model/employee-my-suffix.model';
import { EmployeeMySuffixService } from './employee-my-suffix.service';

@Component({
  selector: 'jhi-employee-my-suffix-delete-dialog',
  templateUrl: './employee-my-suffix-delete-dialog.component.html'
})
export class EmployeeMySuffixDeleteDialogComponent {
  employee: IEmployeeMySuffix;

  constructor(
    protected employeeService: EmployeeMySuffixService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.employeeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'employeeListModification',
        content: 'Deleted an employee'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-employee-my-suffix-delete-popup',
  template: ''
})
export class EmployeeMySuffixDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ employee }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(EmployeeMySuffixDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.employee = employee;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/employee-my-suffix', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/employee-my-suffix', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
