import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IArticle } from 'app/shared/model/article.model';
import { Principal } from 'app/core';
import { ArticleService } from './article.service';
import { LocalDataSource } from 'ng2-smart-table';
import { isNullOrUndefined } from 'util';
import { isDefined } from '@angular/compiler/src/util';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-article',
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit, OnDestroy {
    articles: IArticle[];
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
            addButtonContent: 'Create new article'
        },
        mode: 'external',
        columns: {
            id: {
                title: 'ID',
                editable: false,
                addable: false
            },
            name: {
                title: 'Name'
            },
            articleNumber: {
                title: 'Article Number'
            },
            price: {
                title: 'Price'
            },
            availableAmount: {
                title: 'Available amount'
            },
            articleType: {
                title: 'Type'
            }
        }
    };

    constructor(
        private articleService: ArticleService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal,
        private router: Router
    ) {}
    onCustom(event) {
        // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`)
        if (event.action === 'view') {
            this.router.navigateByUrl('article/' + event.data.id + '/view');
        } else if (event.action === 'edit') {
            this.router.navigateByUrl('article/' + event.data.id + '/edit');
        } else if (event.action === 'delete') {
            this.router.navigate(['/', { outlets: { popup: 'article/' + event.data.id + '/delete' } }]);
        }
    }

    loadAll() {
        this.articleService.query().subscribe(
            (res: HttpResponse<IArticle[]>) => {
                this.articles = res.body;
                this.data = new LocalDataSource();
                for (const article of res.body) {
                    if (article.type) {
                        article.articleType = article.type.name;
                    } else {
                        article.articleType = 'Not defined';
                    }
                    this.data.add(article);
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
        this.registerChangeInArticles();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IArticle) {
        return item.id;
    }

    registerChangeInArticles() {
        this.eventSubscriber = this.eventManager.subscribe('articleListModification', response => this.loadAll());
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
    createNew() {
        this.router.navigateByUrl('/article/new');
    }
}
