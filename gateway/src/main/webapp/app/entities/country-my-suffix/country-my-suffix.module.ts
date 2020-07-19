import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { CountryMySuffixComponent } from './country-my-suffix.component';
import { CountryMySuffixDetailComponent } from './country-my-suffix-detail.component';
import { CountryMySuffixUpdateComponent } from './country-my-suffix-update.component';
import { CountryMySuffixDeletePopupComponent, CountryMySuffixDeleteDialogComponent } from './country-my-suffix-delete-dialog.component';
import { countryRoute, countryPopupRoute } from './country-my-suffix.route';

const ENTITY_STATES = [...countryRoute, ...countryPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CountryMySuffixComponent,
    CountryMySuffixDetailComponent,
    CountryMySuffixUpdateComponent,
    CountryMySuffixDeleteDialogComponent,
    CountryMySuffixDeletePopupComponent
  ],
  entryComponents: [CountryMySuffixDeleteDialogComponent]
})
export class GatewayCountryMySuffixModule {}
