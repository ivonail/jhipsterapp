import { IClient } from 'app/shared/model//client.model';

export interface ICity {
    id?: number;
    name?: string;
    zipcode?: string;
    clients?: IClient[];
}

export class City implements ICity {
    constructor(public id?: number, public name?: string, public zipcode?: string, public clients?: IClient[]) {}
}
