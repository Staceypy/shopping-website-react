import { useShoppingCart } from "../context/CartContext";
import { Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { IProduct } from "../models/models";

type CartItemProps = {
    id: number
    quantity: number
}
export default CartItemProps;
export function CartItem({ id, quantity }: CartItemProps) {
    const { 
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart 
    } = useShoppingCart()
    const [products, setProducts] = useState<IProduct[]>([]);
    useEffect(() => {
      getAllItems();
    }, []);

  const getAllItems = async () => {
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
          console.log("An error occurred while fetching offer items");
        }
      } catch (error) {
        console.error("An error occurred while fetching offer items:", error);
      }
    };
    

    const item = products.find(i => i.id === id)
    if (item == null) return null

    return (
       
        <tr key={id}>
            <td><img src={item.imgurl} alt={item.productName} width="100" /></td>
            <td>{item.productName}</td>
            <td>{item.price} dkk</td>
            <td>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => decreaseCartQuantity(item.id)}
        >
          -
        </Button>
        {quantity}
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => increaseCartQuantity(item.id)}
        >
          +
        </Button>
      </td>
            <td>{item.price*quantity} dkk.</td>
            <td>
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    > &times; </Button></td>
          </tr>
        

    )
}

