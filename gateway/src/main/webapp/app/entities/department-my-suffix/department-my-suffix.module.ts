import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { DepartmentMySuffixComponent } from './department-my-suffix.component';
import { DepartmentMySuffixDetailComponent } from './department-my-suffix-detail.component';
import { DepartmentMySuffixUpdateComponent } from './department-my-suffix-update.component';
import {
  DepartmentMySuffixDeletePopupComponent,
  DepartmentMySuffixDeleteDialogComponent
} from './department-my-suffix-delete-dialog.component';
import { departmentRoute, departmentPopupRoute } from './department-my-suffix.route';

const ENTITY_STATES = [...departmentRoute, ...departmentPopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DepartmentMySuffixComponent,
    DepartmentMySuffixDetailComponent,
    DepartmentMySuffixUpdateComponent,
    DepartmentMySuffixDeleteDialogComponent,
    DepartmentMySuffixDeletePopupComponent
  ],
  entryComponents: [DepartmentMySuffixDeleteDialogComponent]
})
export class GatewayDepartmentMySuffixModule {}
