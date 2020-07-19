import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { JobHistoryMySuffixComponent } from './job-history-my-suffix.component';
import { JobHistoryMySuffixDetailComponent } from './job-history-my-suffix-detail.component';
import { JobHistoryMySuffixUpdateComponent } from './job-history-my-suffix-update.component';
import {
  JobHistoryMySuffixDeletePopupComponent,
  JobHistoryMySuffixDeleteDialogComponent
} from './job-history-my-suffix-delete-dialog.component';
import { jobHistoryRoute, jobHistoryPopupRoute } from './job-history-my-suffix.route';

const ENTITY_STATES = [...jobHistoryRoute, ...jobHistoryPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    JobHistoryMySuffixComponent,
    JobHistoryMySuffixDetailComponent,
    JobHistoryMySuffixUpdateComponent,
    JobHistoryMySuffixDeleteDialogComponent,
    JobHistoryMySuffixDeletePopupComponent
  ],
  entryComponents: [JobHistoryMySuffixDeleteDialogComponent]
})
export class GatewayJobHistoryMySuffixModule {}
