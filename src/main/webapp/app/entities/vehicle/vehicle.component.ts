import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IVehicle } from 'app/shared/model/vehicle.model';
import { Principal } from 'app/core';
import { VehicleService } from './vehicle.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-vehicle',
    templateUrl: './vehicle.component.html'
})
export class VehicleComponent implements OnInit, OnDestroy {
    vehicles: IVehicle[];
    currentAccount: any;
    eventSubscriber: Subscription;
    data: LocalDataSource;
    settings = {
        actions: {
            custom: [
                {
                    name: 'view',
                    title: 'View '
                },
                {
                    name: 'delete',
                    title: 'Delete '
                }
            ],
            delete: false
            // edit: false
        },
        add: {
            create: true,
            addButtonContent: 'Create new vehicle'
        },
        // mode: 'external',
        columns: {
            id: {
                title: 'ID',
                editable: false,
                addable: false
            },
            vehicleNumber: {
                title: 'Vehicle number'
            },
            brand: {
                title: 'Brand'
            },
            model: {
                title: 'Model'
            }
        }
    };
    constructor(
        private vehicleService: VehicleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}
    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
        if (event.action === 'view') {
            this.router.navigateByUrl('vehicle/' + event.data.id + '/view');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'vehicle/' + event.data.id + '/delete' } }]);
        }
    }
    loadAll() {
        this.vehicleService.query().subscribe(
            (res: HttpResponse<IVehicle[]>) => {
                this.vehicles = res.body;
                this.data = new LocalDataSource();
                for (const vehicle of res.body) {
                    this.data.add(vehicle);
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInVehicles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IVehicle) {
        return item.id;
    }

    registerChangeInVehicles() {
        this.eventSubscriber = this.eventManager.subscribe('vehicleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
