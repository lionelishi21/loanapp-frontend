import { NgModule } from '@angular/core';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { MaterialModule } from '../shared/material.module';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
    imports: [
        MaterialModule,
        UserProfileRoutingModule,
    ],
    declarations: [
        UserProfileComponent,
    ]
})

export class UserProfileModule {}
