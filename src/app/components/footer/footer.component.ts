import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { settings } from '../../auth/auth.selectors';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  today: Date = new Date();
  businessName: any;

  currentSettings$: any;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.currentSettings$ = this.store.pipe(select(settings));
  }

}
