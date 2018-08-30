export interface IArticle {
    id?: number;
    name?: string;
    articleNumber?: number;
    price?: number;
    availableAmount?: number;
}

export class Article implements IArticle {
    constructor(
        public id?: number,
        public name?: string,
        public articleNumber?: number,
        public price?: number,
        public availableAmount?: number
    ) {}
}
