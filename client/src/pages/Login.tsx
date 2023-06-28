import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Customer } from "../types";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import react, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import React from "react";
import { useShoppingCart } from "../context/CartContext";


export const Login = () => {
  //const {cartItems, removeAllItems} = useShoppingCart();
  const [customer, setCustomer] = useState();
  const navigate = useNavigate();
  // redux built in method that allows you to choose which state you want to use defined in your store

  const customerRedux = useSelector(
    (state: { customer: Customer | null }) => state.customer
  ); //variable that stores the state of customer from the Redux Store
  
    let deleteGuest = async (email: string) => {
    // helper function to delete a guest customer account by email
    let response = await fetch(`http://localhost:2800/customers/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return response.json();
    } else if (response.status === 400) {
      return null;
    }
  };

  const dispatch = useDispatch();
  // the function handles logout of a customer, called on click on the button 'signout'
  const handleLogout = () => {
    dispatch({ type: "CLEAR_CUSTOMER" });
    navigate("/");
  };

  // method to ready the information from the login form, validate it, and update the state in the customerRedux if relevant
  const store = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("current customer", customerRedux);


    // read input vals from the form, that need to be validated
    let email = event.currentTarget.email.value.toLowerCase().trim();
    let fname = event.currentTarget.fname.value.toLowerCase().trim();
    let lname = event.currentTarget.lname.value.toLowerCase().trim();
    let pass = event.currentTarget.pass.value.trim();

    // switch statement to validate the input and prompt the user if one of more fields are invalid.
    switch (true) {
      case !validateInput(email, "email"):
        alert("Please enter a valid email address.");
        return;
      case !validateInput(fname, "fname"):
        alert("Please enter a valid first name.");
        return;
      case !validateInput(lname, "lname"):
        alert("Please enter a valid last name.");
        return;
      default: //inputs are valid no message is prompted
        break;
    }

    let data = await getCustomer(email);
    console.log("customer after api",customerRedux);

    if(data === null){
      console.log("Login failed: customer does not exist");
      alert("Login failed: customer does not exist. Please try with different account information or register.");
    }
    const matchingCustomer = data;
    console.log(matchingCustomer);
    
    // if the customer exists, we check if the password, first name and last name match
    if (matchingCustomer) {
      if (
        matchingCustomer.password === pass &&
        matchingCustomer.firstName === fname &&
        matchingCustomer.lastName === lname
      ) {

        dispatch({ type: "SET_CUSTOMER", payload: matchingCustomer });

        console.log("Login successful");
        console.log("customer after the set customer", matchingCustomer);
        navigate("/");
      } else {
        let errorMessage = "Login failed:";
        if (matchingCustomer.pass !== pass) {
          errorMessage += " incorrect password";
        }
        if (matchingCustomer.firstName !== fname) {
          errorMessage += " incorrect first name";
        }
        if (matchingCustomer.lastName !== lname) {
          errorMessage += " incorrect last name";
        }
        console.log("Login failed");
        alert(errorMessage);
      }
    }
  };

  // method that uses an API call to get the customer details when signing in
  // if we don't already have a signed in user (if we do, the value of the signed custmer is stored in customerRedux)
  let getCustomer = async (email: string) => {
    let response = await fetch(`http://localhost:2800/customers/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Customer exists, return the data
      return response.json();
    } else if (response.status === 400) {
      // Customer does not exist
      return null;
    }
  };

  let removeCustomer = async () => {
    let response = await fetch(`http://localhost:2800/customers/${customerRedux?.email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // Customer exists, return the data
      return response.json();
    } else if (response.status === 400) {
      // Customer does not exist
      return null;
    }
  };


  // helper function that validates input strings in email, fname and lname. It does not allow for name and last name to contain anything but letters, whitespace and hyphens.
  // i.e. no numbers or special characters
  // for email, we check for at least 1 character before @, 1 before the . symbol and one character after. Also, no whitespaces, # $ and % are not allowed.
  const validateInput = (
    input: string,
    validationType: "email" | "fname" | "lname"
  ): boolean => {
    let regexPattern: RegExp;
    switch (validationType) {
      case "email":
        regexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        break;
      case "fname":
      case "lname":
        regexPattern = /^[a-zA-Z\s-]+$/;
        break;
      default:
        throw new Error("Invalid validation type");
    }
    return regexPattern.test(input);
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RETURNED COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  return (
    <Container className="vh-100">
      {customerRedux && customerRedux.firstName !== 'guest' ? ( //ternary operator; if we have a value for customerRedux, we return a logout page, otherwise, the login form.
        <div>
          <h3>Ready to call it a day, {capitalizeFirstLetter(customerRedux?.firstName)}?</h3>
          <p>Click below to logout, but don't be a strager!</p>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ) : (
        <Row className="h-100 align-items-center justify-content-center">
          <Col xl={10}>
            <div className="card" style={{ borderRadius: "1rem" }}>
              <Row>
                <Col md={6} lg={5} className="d-none d-md-block">
                  <Image
                    src="..\img\logint.png"
                    alt="login form"
                    fluid
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  ></Image>
                </Col>
                <Col md={6} lg={7} className="d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <Form onSubmit={store}>
                      <Form.Group controlId="fname">
                        <Form.Label>First name:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter first name"
                        />
                      </Form.Group>
                      <Form.Group controlId="lname">
                        <Form.Label>Last name:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter last name"
                        />
                      </Form.Group>

                      <Form.Group controlId="email">
                        <Form.Label>Email address:</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                      </Form.Group>

                      <Form.Group controlId="pass">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter password"
                        />
                      </Form.Group>
                      

                      <Button variant="primary" type="submit" className="mt-4">
                        Login
                      </Button>
                      <Button variant="secondary" className="mt-4" onClick={() => navigate("/") }>
                        Cancel
                      </Button>

                      <div className="mt-3">
                        Not a customer yet? Click{" "}
                        <span className="link-text">
                          <Link to="/register">here</Link>
                        </span>{" "}
                        to register.
                      </div>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default React.memo(Login); //prevents unecessary rendering of the component
