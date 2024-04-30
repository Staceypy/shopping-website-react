"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = void 0;
const express_1 = __importDefault(require("express"));
const customer_controler_1 = require("./customer.controler");
//import {postCustomer, getCustomer, patchCustomer} from './customers.controler'
exports.customerRouter = express_1.default.Router();
// middleware specific to this route
exports.customerRouter.use(express_1.default.json());
// route handlers
exports.customerRouter.post("/customers", customer_controler_1.postCustomer); //create a new customer
exports.customerRouter.get("/customers/:email", customer_controler_1.getCustomerByEmail); //get the customer by email
exports.customerRouter.delete("/customers/:email", customer_controler_1.deleteCustomer); //deletes a customer & respective cart
//customerRouter.get("/customers", getAllCustomers); //get all the customers
//customerRouter.get("/customers/:id", getCustomerID); //get customer id
//customerRouter.get("/customers/:id/firstName", getCustomerFirstName); //get customer firstName
//customerRouter.get("/customers/:id/lastName", getCustomerLastName); //get customer lastName
//customerRouter.get("/customers/:id/email", getCustomerEmail); //get customer email
