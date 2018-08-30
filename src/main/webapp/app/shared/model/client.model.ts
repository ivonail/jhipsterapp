import { ICity } from 'app/shared/model//city.model';

export interface IClient {
    id?: number;
    fistName?: string;
    lastName?: string;
    toCity?: ICity;
}

export class Client implements IClient {
    constructor(public id?: number, public fistName?: string, public lastName?: string, public toCity?: ICity) {}
}
