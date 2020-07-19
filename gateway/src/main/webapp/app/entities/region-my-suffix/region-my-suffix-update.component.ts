import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IRegionMySuffix, RegionMySuffix } from 'app/shared/model/region-my-suffix.model';
import { RegionMySuffixService } from './region-my-suffix.service';

@Component({
  selector: 'jhi-region-my-suffix-update',
  templateUrl: './region-my-suffix-update.component.html'
})
export class RegionMySuffixUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    regionName: []
  });

  constructor(protected regionService: RegionMySuffixService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ region }) => {
      this.updateForm(region);
    });
  }

  updateForm(region: IRegionMySuffix) {
    this.editForm.patchValue({
      id: region.id,
      regionName: region.regionName
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const region = this.createFromForm();
    if (region.id !== undefined) {
      this.subscribeToSaveResponse(this.regionService.update(region));
    } else {
      this.subscribeToSaveResponse(this.regionService.create(region));
    }
  }

  private createFromForm(): IRegionMySuffix {
    return {
      ...new RegionMySuffix(),
      id: this.editForm.get(['id']).value,
      regionName: this.editForm.get(['regionName']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegionMySuffix>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
