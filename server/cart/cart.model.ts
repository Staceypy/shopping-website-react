import { Product } from "../products/product.model";

export interface Cart {
    id: number, //customerID
    items: Product[],
  }


  /*
  export interface Product {
    id: number,
    productName: string,
    price: number,
    tags: string[],
    description: string,
    imgurl: string
  }
  */