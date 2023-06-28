import express from 'express'
import {postCustomer,getCustomerByEmail,deleteCustomer} from './customer.controler'
//import {postCustomer, getCustomer, patchCustomer} from './customers.controler'


export const customerRouter = express.Router();

// middleware specific to this route
customerRouter.use(express.json())

// route handlers
customerRouter.post("/customers", postCustomer); //create a new customer
customerRouter.get("/customers/:email", getCustomerByEmail); //get the customer by email
customerRouter.delete("/customers/:email", deleteCustomer); //deletes a customer & respective cart

//customerRouter.get("/customers", getAllCustomers); //get all the customers
//customerRouter.get("/customers/:id", getCustomerID); //get customer id
//customerRouter.get("/customers/:id/firstName", getCustomerFirstName); //get customer firstName
//customerRouter.get("/customers/:id/lastName", getCustomerLastName); //get customer lastName
//customerRouter.get("/customers/:id/email", getCustomerEmail); //get customer email
