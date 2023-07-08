import { NgModule } from '@angular/core';

import { EmailTemplateSettingRoutingModule } from './email-template-setting-routing.module';
import { MaterialModule } from '../../../shared/material.module';
import { EmailTemplateSettingComponent } from './email-template-setting.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
    imports: [
        MaterialModule,
        EmailTemplateSettingRoutingModule,
        CKEditorModule
    ],
    declarations: [
        EmailTemplateSettingComponent,
    ],
    entryComponents: [
    ]
})

export class EmailTemplateSettingModule {}
