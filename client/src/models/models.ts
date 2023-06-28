export interface IProduct {
    id: number;
    productName: string;
    tags: string[];
    price: number;
    description: string;
    imgurl: string
}

export interface ICart {
    id: number;
    products: IProduct[];
    total: number;

}

export interface ICustomer {
    id: number;
    name: string;
    email: string
}