import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission?: any;
    activeOption?: any;
}
export const ROUTES: RouteInfo[] = [
    { path: '/settings', title: 'General',  icon: '', class: '', permission: ['settings-general'], activeOption: true },
    { path: 'account', title: 'Capital',  icon: '', class: '', permission: ['settings-accounting'], activeOption: false },
    { path: 'borrower', title: 'Borrower',  icon: '', class: '', permission: ['settings-borrowers'], activeOption: false },
    { path: 'branch', title: 'Branches',  icon: '', class: '', permission: ['settings-branches'], activeOption: false },
    { path: 'communication', title: 'Communication',  icon: '', class: '', permission: ['settings-communication'], activeOption: false },
    { path: 'expense', title: 'Expense',  icon: '', class: '', permission: ['settings-expenses'], activeOption: false },
    { path: 'loan', title: 'Loans',  icon: '', class: '', permission: ['settings-loans'], activeOption: false },
    { path: 'payment', title: 'Payments',  icon: '', class: '', permission: ['settings-payments'], activeOption: false },
    { path: 'user', title: 'Users & Roles',  icon: '', class: '', permission: ['settings-users'], activeOption: false }
];

@Component({
    selector: 'sig-setting',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

    settingMenuItems: any[];


    constructor() { }

    ngOnInit() {
        this.settingMenuItems = ROUTES.filter(menuItem => menuItem);
    }

}
