import { Routes, RouterModule } from '@angular/router';
import { GuarantorComponent } from './guarantor.component';
import { EditGuarantorComponent } from './edit/edit-guarantor.component';
import { AddGuarantorComponent } from './add/add-guarantor.component';

export const ROUTES: Routes = [
    { path: '', component: GuarantorComponent },
    { path: ':id/edit', component: EditGuarantorComponent },
    { path: 'create', component: AddGuarantorComponent },
];

export const GuarantorRoutingModule = RouterModule.forChild(ROUTES);
