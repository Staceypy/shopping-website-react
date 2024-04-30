import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "../Store";
import { Customer } from "../types";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "../scssFiles/header.scss";
import "../scssFiles/style.scss";
import styles from "./header.module.css";
import logo from "../img/logo.png";
import { CartFill } from "react-bootstrap-icons";

export function Header() {
  // const [userName, setUserName] = useState("");
  const [loginText, setLoginText] = useState("");
  const [loginTarget, setLoginTarget] = useState("");
  const customer = useSelector(
    (state: { customer: Customer | null }) => state.customer
  );
  useEffect(() => {
    judgeLogin();
  }, []);

  function judgeLogin() {
    if (customer?.firstName === undefined) {
      setLoginText("Login");
      setLoginTarget("/login");
    } else {
      setLoginText("Logout");
    }
  }
  const navbar = styles.navbar;

  return (
    <Navbar bg="white" expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand>
          <img src="../img/logo.png" alt="Logo" className="logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link to="/" as={NavLink}>
              <span className={styles.navbar}>Home</span>
            </Nav.Link>
            <Nav.Link to="/products" as={NavLink}>
              <span className={styles.navbar}>Products</span>
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link to="/login" as={NavLink}>
              <i className="fas fa-user-circle"></i>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/cart">
              <i className="fas fa-shopping-cart"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
