import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HasPermissionDirective } from '../shared/directives/has-permission-directive';
import { MaterialModule } from '../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
      MaterialModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
   // HasPermissionDirective
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent
  ]
})
export class ComponentsModule { }
