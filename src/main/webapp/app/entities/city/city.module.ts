import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { BrezaSharedModule } from 'app/shared';
import {
    CityComponent,
    CityDetailComponent,
    CityUpdateComponent,
    CityDeletePopupComponent,
    CityDeleteDialogComponent,
    cityRoute,
    cityPopupRoute
} from './';

const ENTITY_STATES = [...cityRoute, ...cityPopupRoute];

@NgModule({
    imports: [BrezaSharedModule, RouterModule.forChild(ENTITY_STATES), Ng2SmartTableModule],
    declarations: [CityComponent, CityDetailComponent, CityUpdateComponent, CityDeleteDialogComponent, CityDeletePopupComponent],
    entryComponents: [CityComponent, CityUpdateComponent, CityDeleteDialogComponent, CityDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrezaCityModule {}
