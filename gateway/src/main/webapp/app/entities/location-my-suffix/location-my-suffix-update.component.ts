import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ILocationMySuffix, LocationMySuffix } from 'app/shared/model/location-my-suffix.model';
import { LocationMySuffixService } from './location-my-suffix.service';
import { ICountryMySuffix } from 'app/shared/model/country-my-suffix.model';
import { CountryMySuffixService } from 'app/entities/country-my-suffix/country-my-suffix.service';

@Component({
  selector: 'jhi-location-my-suffix-update',
  templateUrl: './location-my-suffix-update.component.html'
})
export class LocationMySuffixUpdateComponent implements OnInit {
  isSaving: boolean;

  countries: ICountryMySuffix[];

  editForm = this.fb.group({
    id: [],
    streetAddress: [],
    postalCode: [],
    city: [],
    stateProvince: [],
    country: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected locationService: LocationMySuffixService,
    protected countryService: CountryMySuffixService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);
    });
    this.countryService
      .query({ filter: 'location-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<ICountryMySuffix[]>) => mayBeOk.ok),
        map((response: HttpResponse<ICountryMySuffix[]>) => response.body)
      )
      .subscribe(
        (res: ICountryMySuffix[]) => {
          if (!this.editForm.get('country').value || !this.editForm.get('country').value.id) {
            this.countries = res;
          } else {
            this.countryService
              .find(this.editForm.get('country').value.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<ICountryMySuffix>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<ICountryMySuffix>) => subResponse.body)
              )
              .subscribe(
                (subRes: ICountryMySuffix) => (this.countries = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(location: ILocationMySuffix) {
    this.editForm.patchValue({
      id: location.id,
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      city: location.city,
      stateProvince: location.stateProvince,
      country: location.country
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  private createFromForm(): ILocationMySuffix {
    return {
      ...new LocationMySuffix(),
      id: this.editForm.get(['id']).value,
      streetAddress: this.editForm.get(['streetAddress']).value,
      postalCode: this.editForm.get(['postalCode']).value,
      city: this.editForm.get(['city']).value,
      stateProvince: this.editForm.get(['stateProvince']).value,
      country: this.editForm.get(['country']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocationMySuffix>>) {
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

  trackCountryById(index: number, item: ICountryMySuffix) {
    return item.id;
  }
}
