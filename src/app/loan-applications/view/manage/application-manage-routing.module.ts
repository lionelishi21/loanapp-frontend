import { Routes, RouterModule } from '@angular/router';
import { ApplicationManageComponent } from './application-manage.component';

export const ROUTES: Routes = [
    { path: '', component: ApplicationManageComponent }
];
export const ApplicationManageRoutingModule = RouterModule.forChild(ROUTES);
