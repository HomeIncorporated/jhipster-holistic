import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from 'app/shared/shared.module';
import { EmployeeMySuffixComponent } from './employee-my-suffix.component';
import { EmployeeMySuffixDetailComponent } from './employee-my-suffix-detail.component';
import { EmployeeMySuffixUpdateComponent } from './employee-my-suffix-update.component';
import { EmployeeMySuffixDeletePopupComponent, EmployeeMySuffixDeleteDialogComponent } from './employee-my-suffix-delete-dialog.component';
import { employeeRoute, employeePopupRoute } from './employee-my-suffix.route';

const ENTITY_STATES = [...employeeRoute, ...employeePopupRoute];

@NgModule({
  imports: [GatewaySharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EmployeeMySuffixComponent,
    EmployeeMySuffixDetailComponent,
    EmployeeMySuffixUpdateComponent,
    EmployeeMySuffixDeleteDialogComponent,
    EmployeeMySuffixDeletePopupComponent
  ],
  entryComponents: [EmployeeMySuffixDeleteDialogComponent]
})
export class GatewayEmployeeMySuffixModule {}
