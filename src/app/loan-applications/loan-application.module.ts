import { NgModule } from '@angular/core';

import { LoanApplicationRoutingModule } from './loan-application-routing.module';
import { LoanApplicationComponent } from './loan-application.component';
import { MaterialModule } from '../shared/material.module';
import { EditLoanApplicationComponent } from './edit/edit-loan-application.component';
import { AddLoanApplicationComponent } from './add/add-loan-application.component';
import { AddGuarantorComponent } from './guarantors/add-guarantor.component';
import { ViewLoanApplicationComponent } from './view/view-loan-application.component';
import { ViewApplicationGeneralComponent } from './view/general/view-application-general.component';
import { ApplicationGuarantorComponent } from './view/guarantor/application-guarantor.component';
import { AddApplicationGuarantorComponent } from './view/guarantor/add/add-application-guarantor.component';
import { EditApplicationGuarantorComponent } from './view/guarantor/edit/edit-application-guarantor.component';
import { ApplicationSecurityComponent } from './view/securitty/application-security.component';
import { AddApplicationSecurityComponent } from './view/securitty/add/add-application-security.component';
import { EditApplicationSecurityComponent } from './view/securitty/edit/edit-application-security.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CalculatorComponent } from './calculator/calculator.component';

@NgModule({
    imports: [
        MaterialModule,
        LoanApplicationRoutingModule,
        MatMomentDateModule
    ],
    declarations: [
        LoanApplicationComponent,
        EditLoanApplicationComponent,
        AddLoanApplicationComponent,
        AddGuarantorComponent,
        ViewLoanApplicationComponent,
        ViewApplicationGeneralComponent,
        ApplicationGuarantorComponent,
        AddApplicationGuarantorComponent,
        EditApplicationGuarantorComponent,
        ApplicationSecurityComponent,
        AddApplicationSecurityComponent,
        EditApplicationSecurityComponent,
        CalculatorComponent
    ],
    entryComponents: [
        EditLoanApplicationComponent,
        AddLoanApplicationComponent,
        AddGuarantorComponent,
        AddApplicationGuarantorComponent,
        EditApplicationGuarantorComponent,
        AddApplicationSecurityComponent,
        EditApplicationSecurityComponent,
        CalculatorComponent
    ]
})

export class LoanApplicationModule {}
