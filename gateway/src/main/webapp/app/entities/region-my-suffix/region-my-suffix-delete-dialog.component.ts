import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRegionMySuffix } from 'app/shared/model/region-my-suffix.model';
import { RegionMySuffixService } from './region-my-suffix.service';

@Component({
  selector: 'jhi-region-my-suffix-delete-dialog',
  templateUrl: './region-my-suffix-delete-dialog.component.html'
})
export class RegionMySuffixDeleteDialogComponent {
  region: IRegionMySuffix;

  constructor(
    protected regionService: RegionMySuffixService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.regionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'regionListModification',
        content: 'Deleted an region'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-region-my-suffix-delete-popup',
  template: ''
})
export class RegionMySuffixDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ region }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(RegionMySuffixDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.region = region;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/region-my-suffix', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/region-my-suffix', { outlets: { popup: null } }]);
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
