import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { OnlineOrderService } from './online-order.service';
import { OnlineOrderItemService } from 'app/entities/online-order-item';
import { IClient } from 'app/shared/model/client.model';
import { ClientService } from 'app/entities/client';
import { ICity } from 'app/shared/model/city.model';
import { CityService } from 'app/entities/city';
import { DeliveryOrder } from 'app/shared/model/delivery-order.model';
import { DeliveryOrderService } from 'app/entities/delivery-order';
import { IOnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { DeliveryOrderItem } from 'app/shared/model/delivery-order-item.model';
import { DeliveryOrderItemService } from 'app/entities/delivery-order-item';

@Component({
    selector: 'jhi-online-order-update',
    templateUrl: './online-order-update.component.html'
})
export class OnlineOrderUpdateComponent implements OnInit, OnDestroy {
    private _onlineOrder: IOnlineOrder;
    isSaving: boolean;
    eventSubscriber: Subscription;
    eventSubscriber1: Subscription;
    clients: IClient[];
    items: IOnlineOrderItem[];
    cities: ICity[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private onlineOrderService: OnlineOrderService,
        private clientService: ClientService,
        private cityService: CityService,
        private deliveryOrderService: DeliveryOrderService,
        private deliveryOrderItemService: DeliveryOrderItemService,
        private onlineOrderItemService: OnlineOrderItemService,
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        this.registerTotalPriceChange();
        this.registerOnlineOrderChange();
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ onlineOrder }) => {
            this.onlineOrder = onlineOrder;
        });
        this.clientService.query().subscribe(
            (res: HttpResponse<IClient[]>) => {
                this.clients = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.cityService.query().subscribe(
            (res: HttpResponse<ICity[]>) => {
                this.cities = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.onlineOrder.id !== undefined) {
            this.subscribeToSaveResponse(this.onlineOrderService.update(this.onlineOrder));
        } else {
            this.subscribeToSaveResponse(this.onlineOrderService.create(this.onlineOrder));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IOnlineOrder>>) {
        result.subscribe((res: HttpResponse<IOnlineOrder>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        // this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackClientById(index: number, item: IClient) {
        return item.id;
    }

    trackCityById(index: number, item: ICity) {
        return item.id;
    }
    get onlineOrder() {
        return this._onlineOrder;
    }

    set onlineOrder(onlineOrder: IOnlineOrder) {
        this._onlineOrder = onlineOrder;
    }

    ruta() {
        if (this.route.url.includes('edit')) {
            return true;
        } else {
            return false;
        }
    }
    registerOnlineOrderChange() {
        this.eventSubscriber = this.eventManager.subscribe('updateOnlineOrder', response => this.save());
    }

    ngOnDestroy() {
        console.log('Ng on Destroy');
        this.eventManager.destroy(this.eventSubscriber);
        this.eventManager.destroy(this.eventSubscriber1);
    }

    registerTotalPriceChange() {
        this.eventSubscriber1 = this.eventManager.subscribe(
            'updateTotalPrice',
            response => (this.onlineOrder.totalPrice = response.content)
        );
    }
    finishOrder() {
        this.save();
        const deliveryOrderItem = new DeliveryOrderItem();
        const deliveryOrder = new DeliveryOrder();
        deliveryOrder.status = 'NEW';
        deliveryOrder.onlineOrder = this.onlineOrder;
        deliveryOrderItem.deliveryOrder = deliveryOrder;
        this.deliveryOrderService.create(deliveryOrder).subscribe();
        this.onlineOrderItemService.findByOrderId(deliveryOrder.onlineOrder.id).subscribe((res: HttpResponse<IOnlineOrderItem[]>) => {
            this.items = res.body;
            for (const item of this.items) {
                deliveryOrderItem.onlineOrderItem = item;
                this.deliveryOrderItemService.create(deliveryOrderItem).subscribe();
            }
        });
        this.previousState();
    }
}
