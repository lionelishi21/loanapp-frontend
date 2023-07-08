import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SetupService } from '../data/setup.service';
import { DatabaseSetupModel } from '../data/database.setup.model';
import { UserSetupModel } from '../data/user.setup.model';

@Component({templateUrl: 'requirements.component.html'})
export class RequirementsComponent implements OnInit {

    displayedColumns = [
        'display_name',
        'status'
    ];

    loader = true;

    requirementsDataSource: any;
    permissionsDataSource: any;
    all_permission_set = false;

    databaseForm: FormGroup;
    userSetupForm: FormGroup;

    returnUrl: string;
    setUpError = '';
    loading = false;

    database: DatabaseSetupModel;
    user: UserSetupModel;

    formErrors: any;

    requirements: any;
    all_set = false;
    already_installed = false;
    show_setup = false;

    showRequirementsForm = true;
    showPermissionsForm = false;
    showDatabaseForm = false;
    showUserForm = false;

    constructor(private fb: FormBuilder, private store: Store<AppState>, private route: ActivatedRoute,
                private router: Router, private setupService: SetupService) {
        this.loader = true;
        this.setupService.checkRequirements()
            .subscribe((res) => {
                    this.loader = false;
                    this.requirementsDataSource = res.requirements;

                    this.requirements = res.requirements;
                    this.all_set = res.all_set;
                    this.already_installed = res.already_installed;
                },
                () => {
                    this.loader = false;
                    this.requirements = [];
                }
            );

        this.databaseForm = fb.group({
            host: ['localhost'],
            port: ['3306'],
            database: ['', Validators.required],
            username: ['', Validators.required],
            password: ['']
        });

        this.userSetupForm = fb.group({
            first_name: ['', Validators.required],
            middle_name: [''],
            last_name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            password_confirmation: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    }

    /**
     *
     */
    requirementsCheckComplete() {
        this.showPermissionsForm = true;
        this.showRequirementsForm = false;
        this.showDatabaseForm = false;

        this.loader = true;
        this.setupService.checkPermissions()
            .subscribe((res) => {
                    this.loader = false;
                    this.permissionsDataSource = res.permissions;
                    this.all_permission_set = res.all_permission_set;
                },
                () => {
                    this.loader = false;
                    this.requirements = [];
                }
            );
    }

    permissionsCheckComplete() {
        this.showPermissionsForm = false;
        this.showRequirementsForm = false;
        this.showDatabaseForm = true;
    }

    /**
     * setup database configuration settings
     */
    databaseSetup() {
        const body = Object.assign({}, this.database, this.databaseForm.value);

        this.setUpError = '';
        this.loader = true;

        this.setupService.setUpDatabase(body)
            .subscribe((data) => {
                    this.loader = false;
                // success, we move on to user setup
                    this.showUserForm = true;
                   // this.showRequirementsForm = false;
                    this.showDatabaseForm = false;
                },
                (error) => {
                    this.loader = false;

                    if (error.error && error.error.message) {
                        this.setUpError = error.error.message;
                        return;
                    }
                    //
                    if (error.error && error.error.status_code === 404) {
                        return;
                    }
                    if (error.payment === 0) {
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;
                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            // console.log('Hallo: ' , prop);
                            if (this.databaseForm) {
                                this.databaseForm.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }

                });
    }

    /**
     * Setup a default user
     */
    userSetup() {
        const body = Object.assign({}, this.user, this.userSetupForm.value);

        this.setUpError = '';
        this.loader = true;

        this.setupService.setUpUser(body)
            .subscribe((data) => {
                    this.router.navigate(['/login']);
                    this.loader = false;
                    // success, we move on to user setup
                    this.showUserForm = true;
                    // this.showRequirementsForm = false;
                    this.showDatabaseForm = false;
                },
                (error) => {
                    // console.log(error);
                    this.loader = false;

                    if (error.error && error.error.message) {
                        this.setUpError = error.error.message;
                        return;
                    }
                    // User has no loan
                    if (error.error && error.error.status_code === 404) {
                        return;
                    }
                    if (error.payment === 0) {
                        return;
                    }
                    // An array of all form errors as returned by server
                    this.formErrors = error;

                    if (this.formErrors) {
                        // loop through from fields, If has an error, mark as invalid so mat-error can show
                        for (const prop in this.formErrors) {
                            // console.log('Hallo: ' , prop);
                            if (this.userSetupForm) {
                                this.userSetupForm.controls[prop].setErrors({incorrect: true});
                            }
                        }
                    }

                });
    }
}
