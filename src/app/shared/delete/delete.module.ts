import { NgModule } from '@angular/core';

import { ConfirmationDialogComponent } from './confirmation-dialog-component';
import { MatDialogModule, MatIconModule } from '@angular/material';

@NgModule({
    imports: [
        MatDialogModule,
        MatIconModule
    ],
    declarations: [
        ConfirmationDialogComponent
    ],
    entryComponents: [ConfirmationDialogComponent],
    exports: [
    ]
})

export class DeleteModule {}
