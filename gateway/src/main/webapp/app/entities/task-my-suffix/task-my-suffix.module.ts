import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { TaskMySuffixComponent } from './task-my-suffix.component';
import { TaskMySuffixDetailComponent } from './task-my-suffix-detail.component';
import { TaskMySuffixUpdateComponent } from './task-my-suffix-update.component';
import { TaskMySuffixDeletePopupComponent, TaskMySuffixDeleteDialogComponent } from './task-my-suffix-delete-dialog.component';
import { taskRoute, taskPopupRoute } from './task-my-suffix.route';

const ENTITY_STATES = [...taskRoute, ...taskPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TaskMySuffixComponent,
    TaskMySuffixDetailComponent,
    TaskMySuffixUpdateComponent,
    TaskMySuffixDeleteDialogComponent,
    TaskMySuffixDeletePopupComponent
  ],
  entryComponents: [TaskMySuffixDeleteDialogComponent]
})
export class GatewayTaskMySuffixModule {}
