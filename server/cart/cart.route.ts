import express from 'express'
import {} from './cart.controler'
import {postCart, getItems,deleteCartItems,deleteItems,deleteItem,addItem,decreaseItem,addItemWithQuantity} from './cart.controler'

export const cartRouter = express.Router();

// middleware specific to this route
cartRouter.use(express.json())

cartRouter.post("/cart", postCart); //create a new cart
cartRouter.get("/cart/:id/items", getItems); //get all items
cartRouter.delete("/cart/:id/items/:productId", deleteItem); //remove an item from cart 
cartRouter.delete("/cart/:id/items", deleteCartItems); //remove all items from cart 
cartRouter.put("/cart/:id/items/:productId", addItem); //add an item to cart 
cartRouter.put("/cart/:id/items/:productId/dec", decreaseItem); //decrease one of the item in cart 
cartRouter.put("/cart/:id/items/:productId/:quantity", addItemWithQuantity); //add quantity of an item to cart 




//cartRouter.delete("/cart/:id/items", deleteItems); //delete all items



