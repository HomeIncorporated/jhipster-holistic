import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILocationMySuffix } from 'app/shared/model/location-my-suffix.model';
import { LocationMySuffixService } from './location-my-suffix.service';

@Component({
  selector: 'jhi-location-my-suffix-delete-dialog',
  templateUrl: './location-my-suffix-delete-dialog.component.html'
})
export class LocationMySuffixDeleteDialogComponent {
  location: ILocationMySuffix;

  constructor(
    protected locationService: LocationMySuffixService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.locationService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'locationListModification',
        content: 'Deleted an location'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-location-my-suffix-delete-popup',
  template: ''
})
export class LocationMySuffixDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ location }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(LocationMySuffixDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.location = location;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/location-my-suffix', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/location-my-suffix', { outlets: { popup: null } }]);
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
