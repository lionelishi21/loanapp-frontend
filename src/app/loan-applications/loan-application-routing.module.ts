import { Routes, RouterModule } from '@angular/router';
import { LoanApplicationComponent } from './loan-application.component';
import { AddLoanApplicationComponent } from './add/add-loan-application.component';
import { ViewLoanApplicationComponent } from './view/view-loan-application.component';
import { ViewApplicationGeneralComponent } from './view/general/view-application-general.component';
import { ApplicationGuarantorComponent } from './view/guarantor/application-guarantor.component';
import { ApplicationSecurityComponent } from './view/securitty/application-security.component';
import { LoanApplicationResolverService } from './data/loan-application-resolver.service';
import { PermissionGuardService as PermGuard } from '../auth/permission-guard-service';

export const ROUTES: Routes = [
    { path: '', component: LoanApplicationComponent },
    { path: 'create', component: AddLoanApplicationComponent },
    {
        path: ':id',
        component: ViewLoanApplicationComponent,
        resolve : { loanApp: LoanApplicationResolverService},
        children: [
            { path: '', component: ViewApplicationGeneralComponent },
            { path: 'guarantors', component: ApplicationGuarantorComponent },

            { path: 'collateral', component: ApplicationSecurityComponent },
            {
                path: 'management',
                loadChildren: 'app/loan-applications/view/manage/application-manage.module#ApplicationManageModule',
                canLoad: [PermGuard],
                data: {
                    permissions: ['loan-application-review'],
                    preload: true,
                    delay: true
                }
           },
        ]
    },

];


export const LoanApplicationRoutingModule = RouterModule.forChild(ROUTES);
