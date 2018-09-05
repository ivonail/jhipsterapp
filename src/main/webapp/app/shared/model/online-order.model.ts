export interface IOnlineOrder {
    id?: number;
    adress?: string;
    phoneNumber?: string;
    totalPrice?: number;
}

export class OnlineOrder implements IOnlineOrder {
    constructor(public id?: number, public adress?: string, public phoneNumber?: string, public totalPrice?: number) {}
}
