import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { allScopes } from '../../auth/auth.selectors';

@Directive({
    selector: '[appHasPermission]'
})
export class HasPermissionDirective implements OnInit {
    private currentUser;
    private permissions = [];

    constructor(
        private element: ElementRef,
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private store: Store<AppState>
    ) {
    }

    ngOnInit() {

        const currentUser$ = this.store.pipe(select(allScopes)).subscribe(user => {
            this.currentUser = user;
            this.updateView();
        });
    }

    @Input()
    set appHasPermission(val) {
        this.permissions = val;
        this.updateView();
    }

    private updateView() {
        if (this.checkPermission()) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    private checkPermission() {
        let hasPermission = false;

        if (this.currentUser && this.permissions !== undefined ) {
            for (const checkPermission of this.permissions) {
                const permissionFound = this.currentUser.find(x => x.toUpperCase() === checkPermission.toUpperCase());
                if (permissionFound) {
                    hasPermission = true;
                }
            }
        }
        return hasPermission;
    }
}
