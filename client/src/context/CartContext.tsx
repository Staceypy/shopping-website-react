import { createContext, ReactNode, useContext, useState, useEffect } from "react"
import { useSelector } from "react-redux";
import { IProduct } from "../models/models";

type CartProviderProps = {
  children: ReactNode
}

type CartItem = {
  id: number;
  price: number;
  quantity: number;
}

type CartContext = {
  
  getItemQuantity: (id: number) => number
  increaseCartQuantity: (id: number) => void
  decreaseCartQuantity: (id: number) => void
  removeFromCart: (id: number) => void
  addToCart: (id: number, quantity: number) => void
  cartQuantity: number
  cartItems: CartItem[]
}

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  pass: string;
};


const CartContext = createContext({} as CartContext)

export function useShoppingCart() {
  return useContext(CartContext)
}
export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  // Fetch products data from an API or Redux store
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:2800/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.log("An error occurred while fetching products");
      }
    } catch (error) {
      console.error("An error occurred while fetching products:", error);
    }
  };

  const customer = useSelector(
    (state: { customer: Customer | null }) => state.customer
  );
  
  let currentCustomerID = customer?.id;
  //console.log("current customer id", currentCustomerID);

  useEffect(() => {
    if(currentCustomerID){
      getAllItems();
    }
  }, [currentCustomerID]);

  
  const getAllItems = async () => {
    try {
      const response = await fetch(`http://localhost:2800/cart/${currentCustomerID}/items`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items);
      } else {
        // Handle error response accordingly
      }
    } catch (error) {
      console.error("An error occurred while fetching cart items:", error);
      // Handle error accordingly
    }
  };
  

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  )

  
  function getItemQuantity(id: number) {
    return cartItems.find(item => item.id === id)?.quantity || 0
  }
  
  async function addToCart(id: number, quantity: number) {
    try {
      const response = await fetch(`http://localhost:2800/cart/${currentCustomerID}/items/${id}/${quantity}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: quantity,
        }),
      });
  
      if (response.ok) {
        // If the API call is successful, update the cart items state
        const updatedCartItems = [...cartItems];
        const existingItemIndex = updatedCartItems.findIndex((item) => item.id === id);
  
        if (existingItemIndex !== -1) {
          // Item already exists in the cart, update the quantity
          updatedCartItems[existingItemIndex].quantity += quantity;
        } else {
          // Item does not exist in the cart, add it
          updatedCartItems.push({
            id: id,
            price: products.find((p) => p.id === id)?.price || 500,
            quantity: quantity,
          });
        }
  
        setCartItems(updatedCartItems);
      } else {
        alert("Please log in first")
        console.log("Error adding item to cart");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function increaseCartQuantity(id: number) {
    try {
      const response = await fetch(`http://localhost:2800/cart/${currentCustomerID}/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: 1,
        }),
      });
  
      if (response.ok) {
        // If the API call is successful, update the cart items state
        const updatedCartItems = [...cartItems];
        const existingItemIndex = updatedCartItems.findIndex((item) => item.id === id);
  
        if (existingItemIndex !== -1) {
          // Item already exists in the cart, increase the quantity by 1
          updatedCartItems[existingItemIndex].quantity += 1;
        } else {
          // Item does not exist in the cart, add it with quantity 1
          updatedCartItems.push({
            id: id,
            price: products.find((p) => p.id === id)?.price || 500,
            quantity: 1,
          });
        }
  
        setCartItems(updatedCartItems);
      } else {
        console.log("Error increasing 1 item to cart");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function decreaseCartQuantity(id: number) {
    try {
      const response = await fetch(`http://localhost:2800/cart/${currentCustomerID}/items/${id}/dec`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: -1, // Decrease the quantity by 1
        }),
      });
  
      if (response.ok) {
        // If the API call is successful, update the cart items state
        const updatedCartItems = [...cartItems];
        const existingItemIndex = updatedCartItems.findIndex((item) => item.id === id);
  
        if (existingItemIndex !== -1) {
          // Item exists in the cart, decrease the quantity by 1
          updatedCartItems[existingItemIndex].quantity -= 1;
  
          if (updatedCartItems[existingItemIndex].quantity === 0) {
            // If the quantity becomes zero, remove the item from the cart
            updatedCartItems.splice(existingItemIndex, 1);
          }
        }
  
        setCartItems(updatedCartItems);
      } else if (response.status === 400) {
        // Show an alert if the API response code is 400, indicating no more items can be deleted
        alert("You cannot reduce the quantity further. If you wish to completely remove the item from your basket, please click on the cross near the item");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async function removeFromCart(id: number) {
    try {
      const response = await fetch(`http://localhost:2800/cart/${currentCustomerID}/items/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        // If the API call is successful, update the cart items state
        const updatedCartItems = cartItems.filter((item) => item.id !== id);
        setCartItems(updatedCartItems);
      } else {
        // Handle error case
      }
    } catch (error) {
      // Handle error case
    }
  }
  

  return (
    <CartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        addToCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      
    </CartContext.Provider>
  )
}
