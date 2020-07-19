import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { LocationMySuffixComponent } from './location-my-suffix.component';
import { LocationMySuffixDetailComponent } from './location-my-suffix-detail.component';
import { LocationMySuffixUpdateComponent } from './location-my-suffix-update.component';
import { LocationMySuffixDeletePopupComponent, LocationMySuffixDeleteDialogComponent } from './location-my-suffix-delete-dialog.component';
import { locationRoute, locationPopupRoute } from './location-my-suffix.route';

const ENTITY_STATES = [...locationRoute, ...locationPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    LocationMySuffixComponent,
    LocationMySuffixDetailComponent,
    LocationMySuffixUpdateComponent,
    LocationMySuffixDeleteDialogComponent,
    LocationMySuffixDeletePopupComponent
  ],
  entryComponents: [LocationMySuffixDeleteDialogComponent]
})
export class GatewayLocationMySuffixModule {}
