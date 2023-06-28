import * as express from 'express';
import {getAllProducts, getProduct, getOffer} from './product.controler'

const productsrouter = express.Router();

productsrouter.use(express.json());

productsrouter.get("/products", getAllProducts);
productsrouter.get("/products/:id", getProduct);
productsrouter.get("/offer", getOffer);



export { productsrouter };
