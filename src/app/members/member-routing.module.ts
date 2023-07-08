import { Routes, RouterModule } from '@angular/router';
import { MemberComponent } from './member.component';
import { EditMemberComponent } from './edit/edit-member.component';
import { AddMemberComponent } from './add/add-member.component';
import { ViewMemberComponent } from './view/view-member.component';
import { ViewMemberGeneralComponent } from './view/general/view-member-general.component';
import { MemberLoansComponent } from './view/loans/member-loans.component';
import { MemberLoanApplicationsComponent } from './view/loan-applications/member-loan-applications.component';
import { MemberCollateralComponent } from './view/collaterals/member-collateral.component';
import { MemberGuaranteeComponent } from './view/guarantee/member-guarantee.component';
import { MemberPaymentComponent } from './view/payment/member-payment.component';
import { MemberResolverService } from './data/member-resolver.service';

export const ROUTES: Routes = [
    { path: '', component: MemberComponent },
    {
        path: ':id',
        component: ViewMemberComponent,
        resolve : { member: MemberResolverService},
        children: [
            { path: '', component: ViewMemberGeneralComponent },
            { path: 'payments', component: MemberPaymentComponent },
            { path: 'loans', component: MemberLoansComponent },
            { path: 'loan_applications', component: MemberLoanApplicationsComponent },
            { path: 'collateral', component: MemberCollateralComponent },
            { path: 'guarantee', component: MemberGuaranteeComponent }
        ]
    },
    { path: ':id/edit', component: EditMemberComponent },
    { path: 'create', component: AddMemberComponent },
];


export const MemberRoutingModule = RouterModule.forChild(ROUTES);
