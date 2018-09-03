import { IType } from 'app/shared/model//type.model';

export interface IArticle {
    id?: number;
    name?: string;
    articleNumber?: number;
    price?: number;
    availableAmount?: number;
    type?: IType;
    articleType?: string;
}

export class Article implements IArticle {
    constructor(
        public id?: number,
        public name?: string,
        public articleNumber?: number,
        public price?: number,
        public availableAmount?: number,
        public type?: IType
    ) {}
}
