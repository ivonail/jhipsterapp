import { Moment } from 'moment';
import { IVehicle } from 'app/shared/model//vehicle.model';
import { IOnlineOrder } from 'app/shared/model//online-order.model';
import { IEmployee } from 'app/shared/model//employee.model';

export interface IDeliveryOrder {
    id?: number;
    deliveryDate?: Moment;
    status?: string;
    vehicle?: IVehicle;
    onlineOrder?: IOnlineOrder;
    warehouseClerk?: IEmployee;
    driver?: IEmployee;
}

export class DeliveryOrder implements IDeliveryOrder {
    constructor(
        public id?: number,
        public deliveryDate?: Moment,
        public status?: string,
        public vehicle?: IVehicle,
        public onlineOrder?: IOnlineOrder,
        public warehouseClerk?: IEmployee,
        public driver?: IEmployee
    ) {}
}
