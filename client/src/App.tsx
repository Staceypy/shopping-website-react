import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import React from "react";
import { Cart } from "./pages/Cart";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Productlist } from "./pages/Productlist";
import { Header } from "./components/header";
import { Register } from "./pages/Register";
import { CartProvider } from "./context/CartContext";
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import store from './Store';
import { State } from './Store';
import { ProductDescription } from "./pages/ProductDescription";


export const App = () => {
  const customer = useSelector((state:State) => state.customer);

  return (
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Container className="mb-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/products" element={<Productlist />}/>
              <Route path="/products/:id" element={<ProductDescription />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </CartProvider>
  );
};

export default App;
