import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({templateUrl: 'install-start.component.html'})
export class InstallStartComponent implements OnInit {

    returnUrl: string;
    constructor(private route: ActivatedRoute, private router: Router) {
        }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
}
