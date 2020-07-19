import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { JobMySuffixComponent } from './job-my-suffix.component';
import { JobMySuffixDetailComponent } from './job-my-suffix-detail.component';
import { JobMySuffixUpdateComponent } from './job-my-suffix-update.component';
import { JobMySuffixDeletePopupComponent, JobMySuffixDeleteDialogComponent } from './job-my-suffix-delete-dialog.component';
import { jobRoute, jobPopupRoute } from './job-my-suffix.route';

const ENTITY_STATES = [...jobRoute, ...jobPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    JobMySuffixComponent,
    JobMySuffixDetailComponent,
    JobMySuffixUpdateComponent,
    JobMySuffixDeleteDialogComponent,
    JobMySuffixDeletePopupComponent
  ],
  entryComponents: [JobMySuffixDeleteDialogComponent]
})
export class GatewayJobMySuffixModule {}
