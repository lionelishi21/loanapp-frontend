import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Logout } from '../../auth/auth.actions';
import { AppState } from '../../reducers';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../auth/authentication.service';
import { tap } from 'rxjs/operators';
import { settings } from '../../auth/auth.selectors';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    permission?: any;
}

export const ROUTES1: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', permission: ['expense-add'] },
    { path: '/members', title: 'Members',  icon: 'people', class: '', permission: ['member-add'] }
];

export const ROUTES2: RouteInfo[] = [
    { path: '/loans', title: 'Loans -  Active',  icon: 'business', class: '', permission: ['loans-view'] },
    { path: '/loan-applications', title: 'Loan Applications',  icon: 'business', class: '', permission: ['loan-application-add'] },
];

export const ROUTES3: RouteInfo[] = [
    { path: '/payments', title: 'Deposit',  icon: 'attach_money', class: '', permission: ['payments-add'] },
    { path: '/withdrawals', title: 'Withdrawal',  icon: 'attach_money', class: '', permission: ['payments-add'] },
];

export const ROUTES4: RouteInfo[] = [
    { path: '/settings', title: 'Setting',  icon: 'settings', class: '', permission: ['settings-general'] },
    { path: '/reports', title: 'Reports',  icon: 'account_tree', class: '', permission: ['view-reports'] },
    { path: '/expenses', title: 'Expenses',  icon: 'local_airport', class: '', permission: ['expense-add'] },
    { path: '/user-profile', title: 'Profile',  icon: 'person', class: '', permission: ['my-profile'] }
];

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '', permission: ['expense-add'] },
    { path: '/expenses', title: 'Expenses',  icon: 'local_airport', class: '', permission: ['expense-add'] },
    { path: '/members', title: 'Members',  icon: 'people', class: '', permission: ['member-add'] },
    { path: '/loans', title: 'Loans -  Active',  icon: 'business', class: '', permission: ['loans-view'] },
    { path: '/loan-applications', title: 'Loan Applications',  icon: 'attach_file', class: '', permission: ['loan-application-add'] },
    { path: '/payments', title: 'Deposit',  icon: 'attach_money', class: '', permission: ['payments-add'] },
    { path: '/withdrawals', title: 'Withdrawal',  icon: 'attach_money', class: '', permission: ['payments-add'] },
    { path: '/mpesa', title: 'Mpesa',  icon: 'attach_money', class: '', permission: ['settings-general'] },
    { path: '/settings', title: 'Setting',  icon: 'settings', class: '', permission: ['settings-general'] },
    { path: '/reports', title: 'Reports',  icon: 'account_tree', class: '', permission: ['view-reports'] },
    { path: '/user-profile', title: 'Profile',  icon: 'person', class: '', permission: ['my-profile'] }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems1: any[];
  menuItems2: any[];
  menuItems3: any[];
  menuItems4: any[];

  menuItems: any[];
  loading = false;

  businessName: string;

  currentSettings$: any;

  constructor(private auth: AuthenticationService, private router: Router, private store: Store<AppState>) {
      this.currentSettings$ = this.store.pipe(select(settings));
  }

  ngOnInit() {
    this.menuItems1 = ROUTES1.filter(menuItem => menuItem);
    this.menuItems2 = ROUTES2.filter(menuItem => menuItem);
    this.menuItems3 = ROUTES3.filter(menuItem => menuItem);
    this.menuItems4 = ROUTES4.filter(menuItem => menuItem);

    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  logout() {
      this.loading = true;
      this.auth.logout()
          .pipe(tap(
              user => {
                  this.loading = false;
                  this.store.dispatch(new Logout());
              }
          ))
          .subscribe(
              () => {},
              (error) => {
                  this.store.dispatch(new Logout());
                  if (error.error.message) {
                  } else {
                  }
                  this.loading = false;
              });
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
