import { Routes, RouterModule } from '@angular/router';
import { LoanComponent } from './loan.component';
import { EditLoanComponent } from './edit/edit-loan.component';
import { AddLoanComponent } from './add/add-loan.component';
import { ViewLoanComponent } from './view/view-loan.component';
import { LoanResolverService } from './data/loan-resolver.service';
import { ViewLoanGeneralComponent } from './view/general/view-loan-general.component';
import { ViewLoanCollateralComponent } from './view/collateral/view-loan-collateral.component';
import { ViewLoanGuarantorsComponent } from './view/guarantors/view-loan-guarantors.component';
import { ViewLoanPaymentsComponent } from './view/payments/view-loan-payments.component';
import { ViewLoanAdjustmentComponent } from './view/adjustment/view-loan-adjustment.component';

export const ROUTES: Routes = [
    { path: '', component: LoanComponent },
    {
        path: ':id',
        component: ViewLoanComponent,
        resolve : { loan: LoanResolverService},
        children: [
            { path: '', component: ViewLoanGeneralComponent },
            { path: 'adjustments', component: ViewLoanAdjustmentComponent },
            { path: 'payments', component: ViewLoanPaymentsComponent },
            { path: 'collateral', component: ViewLoanCollateralComponent },
            { path: 'guarantors', component: ViewLoanGuarantorsComponent }
        ]
    },
    { path: ':id/edit', component: EditLoanComponent },
    { path: 'create', component: AddLoanComponent },
];


export const LoanRoutingModule = RouterModule.forChild(ROUTES);
