import { ModelManager } from "../model/model-manager";
import { Request, Response } from "express";
import { Customer } from "./customer.model";
import { Cart } from "../cart/cart.model";
const CUSTOMERS_FILE = "./customers.json";
const CART_FILE = "./cart.json";

export async function getCustomerByEmail(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Customer, number>(CUSTOMERS_FILE);
    let email = req.params.email;
    let id = hashString(email);
    let customer = await modelMgr.getByID(id);
    res.json(customer);
  } catch (error: any) {
    // res.statusMessage=
    res.status(400).send(error.message);
  }
}

export async function postCustomer(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Customer, number>(CUSTOMERS_FILE);
    let newCustomerID = hashString(req.body.email);
    let newCustomer = req.body;
    newCustomer.id = newCustomerID;
    await modelMgr.add(newCustomer);

    let cartMgr = new ModelManager<Cart, number>(CART_FILE);
    let newCart = { id: newCustomerID, items: [] };
    await cartMgr.add(newCart);

    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Customer, number>(CUSTOMERS_FILE);
    let id = hashString(req.params.email);
    await modelMgr.remove(id);

    let cartMgr = new ModelManager<Cart, number>(CART_FILE);
    await cartMgr.remove(id);

    res.status(200).json({
      status: "OK. Customer & cart deleted.",
    });
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  hash = Math.abs(hash); // Ensure hash code is positive
  return hash;
};
