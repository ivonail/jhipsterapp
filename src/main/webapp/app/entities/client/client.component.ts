import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IClient } from 'app/shared/model/client.model';
import { Principal } from 'app/core';
import { ClientService } from './client.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-client',
    templateUrl: './client.component.html'
})
export class ClientComponent implements OnInit, OnDestroy {
    clients: IClient[];
    data: LocalDataSource;
    currentAccount: any;
    eventSubscriber: Subscription;
    settings = {
        actions: {
            custom: [
                {
                    name: 'view',
                    title: 'View'
                }
            ]
        },
        add: {
            create: true,
            addButtonContent: 'Create new client'
        },
        mode: 'external',
        columns: {
            name: {
                title: 'Name'
            },
            address: {
                title: 'Adresa'
            },
            phoneNumber: {
                title: 'Phone number'
            },
            email: {
                title: 'E-mail'
            },
            cityClient: {
                title: 'City'
            }
        }
    };

    constructor(
        private clientService: ClientService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}
    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
        this.router.navigateByUrl('client/' + event.data.id + '/view');
    }
    loadAll() {
        this.clientService.query().subscribe(
            (res: HttpResponse<IClient[]>) => {
                this.clients = res.body;
                this.data = new LocalDataSource();
                for (const client of res.body) {
                    client.cityClient = client.city.name;
                    this.data.add(client);
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
        this.registerChangeInClients();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IClient) {
        return item.id;
    }

    registerChangeInClients() {
        this.eventSubscriber = this.eventManager.subscribe('clientListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    createNew() {
        this.router.navigateByUrl('/client/new');
        console.log('blabla');
    }
}
