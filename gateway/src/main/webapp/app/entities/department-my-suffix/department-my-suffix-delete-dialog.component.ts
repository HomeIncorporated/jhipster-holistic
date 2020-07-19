import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDepartmentMySuffix } from 'app/shared/model/department-my-suffix.model';
import { DepartmentMySuffixService } from './department-my-suffix.service';

@Component({
  selector: 'jhi-department-my-suffix-delete-dialog',
  templateUrl: './department-my-suffix-delete-dialog.component.html'
})
export class DepartmentMySuffixDeleteDialogComponent {
  department: IDepartmentMySuffix;

  constructor(
    protected departmentService: DepartmentMySuffixService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.departmentService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'departmentListModification',
        content: 'Deleted an department'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-department-my-suffix-delete-popup',
  template: ''
})
export class DepartmentMySuffixDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ department }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DepartmentMySuffixDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.department = department;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/department-my-suffix', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/department-my-suffix', { outlets: { popup: null } }]);
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
