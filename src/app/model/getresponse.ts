import {IProduct} from './product';
export interface GetResponse {
    _embedded: {
        products: IProduct[];
        _links: {self: {href: string}};
    };
}
