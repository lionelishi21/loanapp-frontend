import { Component, Input } from '@angular/core';
import { MatDialogRef, MatDialog, } from '@angular/material';

@Component({
    selector: 'sig-confirm-dialog',
    templateUrl: './confirmation-dialog-component.html',
})
export class ConfirmationDialogComponent {
    public confirmMessage: string;

    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

}
