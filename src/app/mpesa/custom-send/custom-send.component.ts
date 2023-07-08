import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomSendModel } from '../models/custom-send.model';
import { NotificationService } from '../../shared/notification.service';

@Component({
    selector: 'app-custom-send',
    templateUrl: './custom-send.component.html',
    styleUrls: ['./custom-send.component.css']
})
export class CustomSendComponent implements  OnInit {

    form: FormGroup;
    formErrors: any;
    expense: CustomSendModel;
    loader = false;

    constructor(private fb: FormBuilder, private notification: NotificationService) {
    }

    ngOnInit() {

        this.form = this.fb.group({
            phone: ['', [Validators.required,
                Validators.minLength(9), Validators.maxLength(9)]],
            amount: ['', [Validators.required,
                Validators.minLength(1)]],
            description: ['', [Validators.required,
                Validators.minLength(1)]]
        });
    }

    send() {
    }

    /**
     *
     */
    public onSaveComplete(): void {
        this.loader = false;
        this.form.reset();
    }
}
