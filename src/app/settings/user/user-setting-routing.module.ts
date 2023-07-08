import { Routes, RouterModule } from '@angular/router';
import { UserSettingComponent } from './user-setting.component';

export const ROUTES: Routes = [
    {
        path: '',
        component: UserSettingComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/settings/user/general/user-general-setting.module#UserGeneralSettingModule'
            },
            {
                path: 'roles',
                loadChildren: 'app/settings/user/roles/user-roles-setting.module#UserRolesSettingModule'
            },
            {
                path: 'permissions',
                loadChildren: 'app/settings/user/permissions/user-permissions-setting.module#UserPermissionsSettingModule'
            }
        ]
    }
];

export const UserSettingRoutingModule = RouterModule.forChild(ROUTES);
