import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrder } from 'app/shared/model/online-order.model';
import { Principal } from 'app/core';
import { OnlineOrderService } from './online-order.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-online-order',
    templateUrl: './online-order.component.html'
})
export class OnlineOrderComponent implements OnInit, OnDestroy {
    onlineOrders: IOnlineOrder[];
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
                    name: 'edit',
                    title: 'Edit '
                },
                {
                    name: 'delete',
                    title: 'Delete '
                }
            ],
            delete: false,
            edit: false
        },
        add: {
            create: true,
            addButtonContent: 'Create new online order'
        },
        mode: 'external',
        columns: {
            id: {
                title: 'ID',
                editable: false,
                addable: false
            },
            address: {
                title: 'Address'
            },
            phoneNumber: {
                title: 'Phone number'
            },
            totalPrice: {
                title: 'Total Price'
            },
            orderCity: {
                title: 'City'
            },
            orderClient: {
                title: 'Client'
            }
        }
    };
    constructor(
        private onlineOrderService: OnlineOrderService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}
    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
        if (event.action === 'view') {
            this.router.navigateByUrl('online-order/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('online-order/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'online-order/' + event.data.id + '/delete' } }]);
        }
    }
    loadAll() {
        this.onlineOrderService.query().subscribe(
            (res: HttpResponse<IOnlineOrder[]>) => {
                this.onlineOrders = res.body;
                this.data = new LocalDataSource();
                for (const order of res.body) {
                    if (order.city) {
                        order.orderCity = order.city.name;
                    } else {
                        order.orderCity = 'Not defined';
                    }
                    if (order.client) {
                        order.orderClient = order.client.name;
                    } else {
                        order.orderClient = 'Not defined';
                    }
                    this.data.add(order);
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
        this.registerChangeInOnlineOrders();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOnlineOrder) {
        return item.id;
    }

    registerChangeInOnlineOrders() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    createNew() {
        this.router.navigateByUrl('/online-order/new');
    }
}
