import { useShoppingCart } from "../context/CartContext";
import { Table } from 'react-bootstrap';

export function CartPriceTable() {
  const { cartItems, getItemQuantity } = useShoppingCart();
  
  function calTotalPrice() {
    let totalPrice = 0;
    cartItems.forEach(item => {
        
          totalPrice += item.price * item.quantity
        
      })
    return totalPrice;
  }

  return (
    <Table>
      <tbody>
        <tr>
          <td>Cart Subtotal</td>
          <td>{calTotalPrice()}</td>
        </tr>
        <tr>
          <td>Shipping</td>
          <td>Free</td>
        </tr>
        <tr>
          <td><strong>Total</strong></td>
          <td><strong>{calTotalPrice()}</strong></td>
        </tr>
      </tbody>
    </Table>
  )
}
