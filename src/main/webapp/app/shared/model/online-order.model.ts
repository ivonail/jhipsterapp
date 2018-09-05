import { IClient } from 'app/shared/model//client.model';
import { ICity } from 'app/shared/model//city.model';

export interface IOnlineOrder {
    id?: number;
    adress?: string;
    phoneNumber?: string;
    totalPrice?: number;
    client?: IClient;
    city?: ICity;
}

export class OnlineOrder implements IOnlineOrder {
    constructor(
        public id?: number,
        public adress?: string,
        public phoneNumber?: string,
        public totalPrice?: number,
        public client?: IClient,
        public city?: ICity
    ) {}
}
