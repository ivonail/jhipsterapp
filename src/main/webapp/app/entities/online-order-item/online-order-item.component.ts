import { Component, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOnlineOrderItem, OnlineOrderItem } from 'app/shared/model/online-order-item.model';
import { Principal } from 'app/core';
import { OnlineOrderItemService } from './online-order-item.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-online-order-item',
    templateUrl: './online-order-item.component.html'
})
export class OnlineOrderItemComponent implements OnInit, OnDestroy {
    onlineOrderItems: IOnlineOrderItem[];
    currentAccount: any;
    eventSubscriber: Subscription;
    data: LocalDataSource;
    onlineOrderId: number;
    total: number;

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
            addButtonContent: 'Create new online order item'
        },
        mode: 'external',
        columns: {
            id: {
                title: 'ID',
                editable: false,
                addable: false
            },
            orderedAmount: {
                title: 'Ordered amount'
            },
            itemPrice: {
                title: 'Full price'
            },
            onlineArticle: {
                title: 'Article'
            },
            articlePrice: {
                title: 'Article price'
            },
            orderId: {
                title: 'Order id'
            }
        }
    };

    constructor(
        private onlineOrderItemService: OnlineOrderItemService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router,
        private route: ActivatedRoute
    ) {}
    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
        if (event.action === 'view') {
            setTimeout(() => {
                this.router.navigate(['online-order/' + this.onlineOrderId + '/online-order-item/' + event.data.id + '/view']);
            }, 100);
        } else if (event.action === 'edit') {
            setTimeout(() => {
                this.router.navigate(['online-order/' + this.onlineOrderId + '/online-order-item/' + event.data.id + '/edit']);
            }, 100);
        } else if (event.action === 'delete') {
            setTimeout(() => {
                this.router.navigate([
                    '/',
                    { outlets: { popup: 'online-order/' + this.onlineOrderId + '/online-order-item/' + event.data.id + '/delete' } }
                ]);
            }, 100);
        }
    }
    loadAll() {
        this.route.params.subscribe(params => {
            this.onlineOrderId = +params['id'];
        });
        this.onlineOrderItemService.findByOrderId(this.onlineOrderId).subscribe(
            (res: HttpResponse<IOnlineOrderItem[]>) => {
                this.onlineOrderItems = res.body;
                this.data = new LocalDataSource();
                this.total = 0;
                for (const item of res.body) {
                    item.itemPrice = item.orderedAmount * item.article.price;
                    this.total = this.total + item.itemPrice;
                    item.onlineOrder.totalPrice = this.total;
                    console.log('total price is ' + this.total);
                    this.eventManager.broadcast({
                        name: 'updateTotalPrice',
                        content: this.total
                    });
                    if (item.article) {
                        item.articlePrice = item.article.price;
                        item.onlineArticle = item.article.name;
                    } else {
                        item.onlineArticle = 'Not defined';
                    }
                    if (item.onlineOrder) {
                        item.orderId = item.onlineOrder.id;
                    }

                    // if (item.orderId === this.onlineOrderId) {
                    //     this.data.add(item);
                    // }
                    this.data.add(item);
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
        this.registerChangeInOnlineOrderItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IOnlineOrderItem) {
        return item.id;
    }

    registerChangeInOnlineOrderItems() {
        this.eventSubscriber = this.eventManager.subscribe('onlineOrderItemListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    createNew() {
        this.eventManager.broadcast({
            name: 'updateOnlineOrder',
            content: ''
        });
        setTimeout(() => {
            this.router.navigate(['online-order/' + this.onlineOrderId + '/online-order-item/new']);
        }, 100);
    }
    ruta() {
        this.route.snapshot.url.toString().includes('new');
    }
}
