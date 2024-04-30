"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseItem = exports.addItem = exports.addItemWithQuantity = exports.deleteItem = exports.deleteItems = exports.deleteCartItems = exports.postCart = exports.getItems = void 0;
const model_manager_1 = require("../model/model-manager");
const CART_FILE = "./cart.json";
const PRODUCT_FILE = "./products.json";
function getItems(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let id = parseInt(req.params.id);
            let cart = yield modelMgr.getByID(id);
            const itemsList = { items: cart.items };
            res.json(itemsList);
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.getItems = getItems;
// creates a new cart
function postCart(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let newCart = req.body;
            yield modelMgr.add(newCart);
            // res.end();
            res.status(200).json({
                status: "OK",
            });
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.postCart = postCart;
// deletes all cart items for a cutomer id
function deleteCartItems(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let id = parseInt(req.params.id);
            const cart = yield modelMgr.getByID(id);
            cart.items = [];
            yield modelMgr.update(id, cart);
            res.end();
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.deleteCartItems = deleteCartItems;
// deletes all cart items for a cutomer id
function deleteItems(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let id = parseInt(req.params.id);
            yield modelMgr.remove(id);
            res.end();
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.deleteItems = deleteItems;
//delete an item from the cart (regardless of quantity)
function deleteItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customerId = parseInt(req.params.id);
            const productId = parseInt(req.params.productId);
            const modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let cart = yield modelMgr.getByID(customerId); // Get the cart for the customer ID
            const updatedItems = cart.items.filter((item) => item.id !== productId); // Remove the item from the cart
            if (updatedItems.length === cart.items.length) {
                res.status(404).json({
                    error: { message: `Item with ID ${productId} not found in the cart for customer with ID ${customerId}` },
                });
            }
            else {
                cart.items = updatedItems;
                yield modelMgr.update(customerId, cart); // Update the cart with the modified items
                res.status(200).json({
                    status: "OK",
                    message: `Item with ID ${productId} has been deleted from the cart for customer with ID ${customerId}`,
                });
            }
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.deleteItem = deleteItem;
// export async function deleteItem(req: Request, res: Response) {
//   try {
//     const customerId = parseInt(req.params.id);
//     let productId = parseInt(req.params.productId);
//     const modelMgr = new ModelManager<Cart, number>(CART_FILE);
//     let cart = await modelMgr.getByID(customerId); //all items for the customer id
//     if (cart.items.length !== 0) {
//       for (let i = 0; i < cart.items.length; i++) {
//         const item = cart.items[i];
//         if (item?.id === productId) {
//           const q = item.quantity;
//           if (q === 1) {
//             let updatedCart = cart.items.filter(
//               (item) => item.id !== productId
//             ); //filter everything
//             cart.items = updatedCart;
//             await modelMgr.update(customerId, cart);
//           } else {
//             item.quantity = (item.quantity ?? 0) - 1;
//             await modelMgr.update(customerId, cart); //update cart with new quantity
//           }
//         }
//       }
//     }
//     res.status(200).json({
//       status: "OK",
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: { message: (error as Error).message },
//     });
//   }
// }
// Add quantity of an item to the cart
function addItemWithQuantity(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let customerId = parseInt(req.params.id);
            let productId = parseInt(req.params.productId);
            let quantity = parseInt(req.params.quantity);
            let modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let productMgr = new model_manager_1.ModelManager(PRODUCT_FILE);
            let cart = yield modelMgr.getByID(customerId); // Get the cart for the customer ID
            let product = yield productMgr.getByID(productId); // Get product details
            if (!quantity || quantity <= 0) {
                res.status(400).json({
                    error: { message: "Invalid quantity input" },
                });
                return;
            }
            if (product) {
                let item = cart.items.find((item) => item.id === productId);
                if (item) {
                    if (item.quantity) {
                        item.quantity = item.quantity + quantity;
                    }
                }
                else {
                    item = Object.assign(Object.assign({}, product), { quantity: quantity }); // Create a new item with the specified quantity
                    cart.items.push(item);
                }
                yield modelMgr.update(customerId, cart); // Update the cart with the modified item
                res.status(200).json({
                    status: "OK",
                    message: `Item with ID ${productId} and quantity ${quantity} has been added to the cart for customer with ID ${customerId}`,
                });
            }
            else {
                res.status(404).json({
                    error: { message: `Product with ID ${productId} not found` },
                });
            }
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.addItemWithQuantity = addItemWithQuantity;
// Add an item to the cart
function addItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let customerId = parseInt(req.params.id);
            let productId = parseInt(req.params.productId);
            let modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let productMgr = new model_manager_1.ModelManager(PRODUCT_FILE);
            let cart = yield modelMgr.getByID(customerId); //all items for the customer id
            let product = yield productMgr.getByID(productId); //get product details
            if (product) {
                let item = cart.items.find((item) => item.id === productId);
                if (item) {
                    if (item.quantity) {
                        item.quantity += 1;
                    }
                }
                else {
                    item = Object.assign(Object.assign({}, product), { quantity: 1 });
                    cart.items.push(item);
                }
                yield modelMgr.update(customerId, cart);
                res.status(200).json({
                    status: "OK",
                    message: `One item with id ${productId} has been added to the cart for customer with id ${customerId}`,
                });
            }
            else {
                // create a new item in the cart
            }
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.addItem = addItem;
// decrease 1 item from the cart
function decreaseItem(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let customerId = parseInt(req.params.id);
            let productId = parseInt(req.params.productId);
            let modelMgr = new model_manager_1.ModelManager(CART_FILE);
            let cart = yield modelMgr.getByID(customerId); // Get the cart for the customer ID
            let item = cart.items.find((item) => item.id === productId);
            if (item) {
                if (item.quantity && item.quantity > 1) {
                    item.quantity -= 1; // Decrease the quantity by 1
                    yield modelMgr.update(customerId, cart); // Update the cart with the modified item
                    res.status(200).json({
                        status: "OK",
                        message: `Quantity of item with ID ${productId} has been decreased by 1 for customer with ID ${customerId}`,
                    });
                }
                else {
                    res.status(400).json({
                        error: { message: `Item with ID ${productId} does not have a valid quantity` },
                    });
                }
            }
            else {
                res.status(404).json({
                    error: { message: `Item with ID ${productId} not found in the cart for customer with ID ${customerId}` },
                });
            }
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.decreaseItem = decreaseItem;
/*

THIS WORKS:

//delete an item from the cart (regardless of quantity)
export async function deleteItem(req: Request, res: Response) {
  try {
    const customerId = parseInt(req.params.id);
    const productId = parseInt(req.query.productId as string); //what we want to remove
    const modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let cart = await modelMgr.getByID(customerId); //all items for the customer id
    let updatedCart = cart.items.filter((item) => item.id !== productId); //filter everything
    cart.items = updatedCart;
    await modelMgr.update(customerId, cart);
    res.status(200).json({
      status: "OK",
      message: `Item with id ${productId} has been removed from the cart for customer with id ${customerId}`,
    });
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}
*/
