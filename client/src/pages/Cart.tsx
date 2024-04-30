import { Table } from "react-bootstrap";
import { CartPriceTable } from "../components/CartPriceTable";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { CartItem } from "../components/CartItem";
import { useShoppingCart } from "../context/CartContext";

type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  pass: string;
};

// type CartItemProps2 = {
//   id: number;
//   productName: string;
//   price: number;
//   tags: string[];
//   description: string;
//   quantity: number;
// };

export function Cart() {
  const { cartItems, getItemQuantity } = useShoppingCart();
  const customer = useSelector(
    (state: { customer: Customer | null }) => state.customer
  );

  // useEffect(() => {
  //   console.log("cart items", cartItems);
  // }, [cartItems]);
  // const currentCustomerID = customer?.id;
  // console.log("current customer id", currentCustomerID);
  // console.log("customer in cart",customer);
  // console.log("cart items", cartItems);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <section id="cart" className="section-p1">
      {customer && customer.firstName !== "guest" ? (
        <div>
          <h2 style={{ marginBottom: "100px" }}>
            Hi {capitalizeFirstLetter(customer?.firstName)}, your cart is
            waiting for you!
          </h2>
        </div>
      ) : (
        <div></div>
      )}
      <Table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <CartItem key={item.id} id={item.id} quantity={item.quantity} />
          ))}
        </tbody>
      </Table>

      <section id="cart-add" className="section-p1">
        <div id="subtotal">
          <h3>Cart Totals</h3>
          <CartPriceTable />
          <button className="normal">Proceed to checkout</button>
        </div>
      </section>
    </section>
  );
}
