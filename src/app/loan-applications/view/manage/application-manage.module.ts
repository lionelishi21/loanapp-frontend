import { NgModule } from '@angular/core';

import { ApplicationManageRoutingModule } from './application-manage-routing.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MaterialModule } from '../../../shared/material.module';
import { ApplicationManageComponent } from './application-manage.component';

@NgModule({
    imports: [
        MaterialModule,
        ApplicationManageRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        ApplicationManageComponent
    ],
    entryComponents: [
    ]
})

export class ApplicationManageModule {}
