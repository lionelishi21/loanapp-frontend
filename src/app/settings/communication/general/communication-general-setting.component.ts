import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ConfirmationDialogComponent } from '../../../shared/delete/confirmation-dialog-component';
import { CommunicationGeneralSettingDataSource } from './data/communication-general-setting-data.source';
import { CommunicationGeneralSettingService } from './data/communication-general-setting.service';
import { EditCommunicationGeneralComponent } from './edit/edit-communication-general.component';
import { NotificationService } from '../../../shared/notification.service';
import { EmailTemplateSettingService } from '../email-template/data/email-template-setting.service';
import { SmsTemplateSettingService } from '../sms-template/data/sms-template-setting.service';
import { CommunicationSettingModel } from './model/communication-setting.model';

@Component({
    selector: 'app-communication-general-setting',
    templateUrl: './communication-general-setting.component.html',
    styleUrls: ['./communication-general-setting.component.css']
})
export class CommunicationGeneralSettingComponent implements OnInit, AfterViewInit {
    displayedColumns = [
        'display_name',
        'email_template',
        'sms_template',
        'actions',
    ];

    loader = false;

    dialogRef: MatDialogRef<ConfirmationDialogComponent>;

    // Search field
    @ViewChild('search', {static: true}) search: ElementRef;
    // pagination
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    // Pagination
    length: number;
    pageIndex = 0;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    meta: any;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    // Data for the list table display
    dataSource: CommunicationGeneralSettingDataSource;

    emailTemplates: any;

    smsTemplates: any;

    constructor(private communicationGeneralSettingService: CommunicationGeneralSettingService,
                private emailTemplateService: EmailTemplateSettingService,
                private notification: NotificationService, private dialog: MatDialog,
                private smsTemplateService: SmsTemplateSettingService ) {
    }

    /**
     * Initialize data source
     * Set pagination data values
     * Initial data load
     */
    ngOnInit() {

        this.dataSource = new CommunicationGeneralSettingDataSource(this.communicationGeneralSettingService);

        // Load pagination data
        this.dataSource.meta$.subscribe((res) => this.meta = res);

        // We load initial data here to avoid affecting life cycle hooks if we load all data on after view init
        this.dataSource.load('', 0, 0, 'display_name', 'asc');

        this.emailTemplateService.list(['name', 'display_name'])
            .subscribe((res) => this.emailTemplates = res,
                () => this.emailTemplates = []
            );

        this.smsTemplateService.list(['name', 'display_name'])
            .subscribe((res) => this.smsTemplates = res,
                () => this.smsTemplates = []
            );
    }

     /**
     * Edit dialog launch
     */
    editDialog(communicationSetting: CommunicationSettingModel) {

        const id = communicationSetting.id;

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {communicationSetting,
            emailTemplates: this.emailTemplates,
            smsTemplates: this.smsTemplates
        };

        const dialogRef = this.dialog.open(EditCommunicationGeneralComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(
            (val) => {
                if ((val)) {
                    this.loadData();
                }
            }
        );
    }

    /**
     * Fetch data from data source
     */
    loadData() {
        this.dataSource.load(
            this.search.nativeElement.value,
            (this.paginator.pageIndex + 1),
            (this.paginator.pageSize),
            this.sort.active,
            this.sort.direction
        );
    }

    /**
     * Handle search and pagination
     */
    ngAfterViewInit() {

        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadData();
                })
            ).subscribe();

        this.paginator.page.pipe(
            tap(() => this.loadData() )
        ).subscribe();

        // reset the paginator after sorting
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadData())
            )
            .subscribe();
    }

    /**
     *
     * @param communicationSetting
     */
    openConfirmationDialog(communicationSetting: CommunicationSettingModel) {

        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: true
        });

        this.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
            this.dialogRef = null;
        });
    }

    /**
     *
     * @param communicationSetting
     */
    delete(communicationSetting: CommunicationSettingModel) {
        this.loader = true;
        this.communicationGeneralSettingService.delete(communicationSetting)
            .subscribe((data) => {
                    this.loader = false;
                    this.loadData();
                    this.notification.showNotification('success', 'Success !! Communication Setting has been deleted.');
                },
                (error) => {
                    this.loader = false;
                    if (!error.error['error']) {
                        this.notification.showNotification('danger', 'Connection Error !! Nothing deleted.' +
                            ' Check Connection and retry. ');
                    } else {
                        this.notification.showNotification('danger', 'Delete Error !! ');
                    }
                });
    }

    /**
     * Empty search box
     */
    clearSearch() {
        this.search.nativeElement.value = '';
        this.loadData()
    }
}
