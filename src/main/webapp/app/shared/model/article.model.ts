export interface IArticle {
    id?: number;
    amount?: number;
    name?: string;
}

export class Article implements IArticle {
    constructor(public id?: number, public amount?: number, public name?: string) {}
}
