import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DashboardResolverService } from '../../dashboard/data/dashboard-resolver.service';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        resolve : { summary: DashboardResolverService}
    }
];
