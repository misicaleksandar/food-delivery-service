import { Product } from "./product.model";

export class Order {
    id: string = '';
    address: string = '';
    lat: number = 0;
    lon: number = 0;
    comment: string = '';
    amount: string = '';
    totalPrice: string = '';
    paymentMethod: string = '';
    paymentCompleted: boolean = false;
    products: Product[] = [];
    year: number = 0;
    month: number = 0;
    day: number = 0;
    hours: number = 0;
    minutes: number = 0;
    seconds: number = 0;
    miliseconds: number = 0;
    delivererId: number = 0;
    customerEmail: string = '';
}
