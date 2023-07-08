import { Routes, RouterModule } from '@angular/router';
import { BorrowerComponent } from './borrower.component';
import { EditBorrowerComponent } from './edit/edit-borrower.component';
import { AddBorrowerComponent } from './add/add-borrower.component';

export const ROUTES: Routes = [
    { path: '', component: BorrowerComponent },
    { path: ':id/edit', component: EditBorrowerComponent },
    { path: 'create', component: AddBorrowerComponent },
];


export const BorrowerRoutingModule = RouterModule.forChild(ROUTES);
