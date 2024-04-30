"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = __importDefault(require("express"));
const cart_controler_1 = require("./cart.controler");
exports.cartRouter = express_1.default.Router();
// middleware specific to this route
exports.cartRouter.use(express_1.default.json());
exports.cartRouter.post("/cart", cart_controler_1.postCart); //create a new cart
exports.cartRouter.get("/cart/:id/items", cart_controler_1.getItems); //get all items
exports.cartRouter.delete("/cart/:id/items/:productId", cart_controler_1.deleteItem); //remove an item from cart 
exports.cartRouter.delete("/cart/:id/items", cart_controler_1.deleteCartItems); //remove all items from cart 
exports.cartRouter.put("/cart/:id/items/:productId", cart_controler_1.addItem); //add an item to cart 
exports.cartRouter.put("/cart/:id/items/:productId/dec", cart_controler_1.decreaseItem); //decrease one of the item in cart 
exports.cartRouter.put("/cart/:id/items/:productId/:quantity", cart_controler_1.addItemWithQuantity); //add quantity of an item to cart 
//cartRouter.delete("/cart/:id/items", deleteItems); //delete all items
