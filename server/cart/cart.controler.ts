import { ModelManager } from "../model/model-manager";
import { Request, Response } from "express";
import { Cart } from "./cart.model";
import { Product } from "../products/product.model";

const CART_FILE = "./cart.json";
const PRODUCT_FILE = "./products.json";


export async function getItems(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let id = parseInt(req.params.id);
    let cart = await modelMgr.getByID(id);
    const itemsList = { items: cart.items };
    res.json(itemsList);
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}

// creates a new cart
export async function postCart(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let newCart = req.body;
    await modelMgr.add(newCart);
    // res.end();
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}


// deletes all cart items for a cutomer id
export async function deleteCartItems(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let id = parseInt(req.params.id);
    const cart = await modelMgr.getByID(id);
    cart.items = [];
    await modelMgr.update(id, cart);
    res.end();
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}


// deletes all cart items for a cutomer id
export async function deleteItems(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let id = parseInt(req.params.id);
    await modelMgr.remove(id);
    res.end();
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}

//delete an item from the cart (regardless of quantity)
export async function deleteItem(req: Request, res: Response) {
  try {
    const customerId = parseInt(req.params.id);
    const productId = parseInt(req.params.productId);
    const modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let cart = await modelMgr.getByID(customerId); // Get the cart for the customer ID

    const updatedItems = cart.items.filter((item) => item.id !== productId); // Remove the item from the cart

    if (updatedItems.length === cart.items.length) {
      res.status(404).json({
        error: { message: `Item with ID ${productId} not found in the cart for customer with ID ${customerId}` },
      });
    } else {
      cart.items = updatedItems;
      await modelMgr.update(customerId, cart); // Update the cart with the modified items

      res.status(200).json({
        status: "OK",
        message: `Item with ID ${productId} has been deleted from the cart for customer with ID ${customerId}`,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}

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
export async function addItemWithQuantity(req: Request, res: Response) {
  try {
    let customerId = parseInt(req.params.id);
    let productId = parseInt(req.params.productId);
    let quantity = parseInt(req.params.quantity);

    let modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let productMgr = new ModelManager<Product, number>(PRODUCT_FILE);
    let cart = await modelMgr.getByID(customerId); // Get the cart for the customer ID
    let product = await productMgr.getByID(productId); // Get product details

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
         
      } else {   
        item = { ...product, quantity: quantity }; // Create a new item with the specified quantity
        cart.items.push(item);        
    }
      await modelMgr.update(customerId, cart); // Update the cart with the modified item
      res.status(200).json({
        status: "OK",
        message: `Item with ID ${productId} and quantity ${quantity} has been added to the cart for customer with ID ${customerId}`,
      });
    } else {
      res.status(404).json({
        error: { message: `Product with ID ${productId} not found` },
      });
    } 
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}


// Add an item to the cart
export async function addItem(req: Request, res: Response) {
  try {
    let customerId = parseInt(req.params.id);
    let productId = parseInt(req.params.productId);
    let modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let productMgr = new ModelManager<Product, number>(PRODUCT_FILE);
    let cart = await modelMgr.getByID(customerId); //all items for the customer id
    let product = await productMgr.getByID(productId); //get product details

    if (product) {
      let item = cart.items.find((item) => item.id === productId);

      if (item) {
        if (item.quantity) {
          item.quantity += 1;
        }
      } else {
        item = { ...product, quantity: 1 };
        cart.items.push(item);
      }

      await modelMgr.update(customerId, cart);

      res.status(200).json({
        status: "OK",
        message: `One item with id ${productId} has been added to the cart for customer with id ${customerId}`,
      });
    } else {
      // create a new item in the cart
    }
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}

// decrease 1 item from the cart
export async function decreaseItem(req: Request, res: Response) {
  try {
    let customerId = parseInt(req.params.id);
    let productId = parseInt(req.params.productId);
    let modelMgr = new ModelManager<Cart, number>(CART_FILE);
    let cart = await modelMgr.getByID(customerId); // Get the cart for the customer ID

    let item = cart.items.find((item) => item.id === productId);

    if (item) {
      if (item.quantity && item.quantity > 1) {
        item.quantity -= 1; // Decrease the quantity by 1
        await modelMgr.update(customerId, cart); // Update the cart with the modified item
        res.status(200).json({
          status: "OK",
          message: `Quantity of item with ID ${productId} has been decreased by 1 for customer with ID ${customerId}`,
        });
      } else {
        res.status(400).json({
          error: { message: `Item with ID ${productId} does not have a valid quantity` },
        });
      }
    } else {
      res.status(404).json({
        error: { message: `Item with ID ${productId} not found in the cart for customer with ID ${customerId}` },
      });
    }
  } catch (error) {
    res.status(400).json({
      error: { message: (error as Error).message },
    });
  }
}


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
