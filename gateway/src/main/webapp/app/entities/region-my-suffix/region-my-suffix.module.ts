import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { RegionMySuffixComponent } from './region-my-suffix.component';
import { RegionMySuffixDetailComponent } from './region-my-suffix-detail.component';
import { RegionMySuffixUpdateComponent } from './region-my-suffix-update.component';
import { RegionMySuffixDeletePopupComponent, RegionMySuffixDeleteDialogComponent } from './region-my-suffix-delete-dialog.component';
import { regionRoute, regionPopupRoute } from './region-my-suffix.route';

const ENTITY_STATES = [...regionRoute, ...regionPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RegionMySuffixComponent,
    RegionMySuffixDetailComponent,
    RegionMySuffixUpdateComponent,
    RegionMySuffixDeleteDialogComponent,
    RegionMySuffixDeletePopupComponent
  ],
  entryComponents: [RegionMySuffixDeleteDialogComponent]
})
export class GatewayRegionMySuffixModule {}
