import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Image
} from "react-bootstrap";
import { Link } from "react-router-dom";


export const Register = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  //handle going back after canceling regustration
  function handleGoBack(){
    navigate('/');
  }

  // Hash function
  /*const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    hash = Math.abs(hash); // Ensure hash code is positive
    return hash;
  }; */

  let login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target);

    let email = e.currentTarget.email.value.toLowerCase().trim();
    let fname = e.currentTarget.fname.value.toLowerCase().trim();
    let lname = e.currentTarget.lname.value.toLowerCase().trim();

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

    // Generate hash code based on email input
    //const hash = hashString(email);

    let response = await fetch("http://localhost:2800/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 0, // Use hash code as ID
        firstName: fname,
        lastName: lname,
        email: email,
        password: e.currentTarget.password.value,
      }),
    });

    let data = await response.json();
    console.log(data);
    console.log(response);
    
    // Display error message if customer with same email already exists
    if (response.status === 400 && data.error.message.includes("already exists")) {
        alert(
            "This email is already registered. Please use a different email address or sign in using the existing email."
            );
        } else {
          if(response.status === 200){

            setUser(data);
            navigate("/login");
          }
        }

    setUser(data);
  };
  
  
  const validateInput = (input: string, validationType: "email" | "fname" | "lname"): boolean => {
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
  
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RETURNED COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  return (
    <Container className="vh-100">
      <Row className="h-100 align-items-center justify-content-center">
        <Col xl={10}>
          <div className="card" style={{ borderRadius: "1rem" }}>
            <Row>
              <Col md={6} lg={5} className="d-none d-md-block">
                <Image
                  src="..\img\register.jpg"
                  alt="login form"
                  fluid
                  style={{ borderRadius: "1rem 0 0 1rem" }}
                ></Image>
              </Col>
              <Col md={6} lg={7} className="d-flex align-items-center">
                <div className="card-body p-4 p-lg-5 text-black">
                  <Form onSubmit={login}>
                    <Form.Group controlId="fname">
                      <Form.Label>First name:</Form.Label>
                      <Form.Control
                        type="text" placeholder="Enter first name" name="firstName"/>
                    </Form.Group>
                    <Form.Group controlId="lname">
                      <Form.Label>Last name:</Form.Label>
                      <Form.Control type="text" placeholder="Enter last name" name="lastName"/>
                    </Form.Group>

                    <Form.Group controlId="email">
                      <Form.Label>Email address:</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" name="email"/>
                    </Form.Group>

                    <Form.Group controlId="pass">
                      <Form.Label>Password:</Form.Label>
                      <Form.Control type="password" placeholder="Enter password" name="password"/>
                    </Form.Group>

                    <Button variant="primary" className="mt-4" type="submit">
                      Submit
                    </Button>
                    <Button variant="secondary" className="mt-4" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
};