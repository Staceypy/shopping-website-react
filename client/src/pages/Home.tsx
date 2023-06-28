import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Customer } from "../types";
import Button from "react-bootstrap/Button";
import styles from "../components/hero.module.css";
import bgvideo from "../components/bgvideo.mp4";
import { Container } from "react-bootstrap";
import { Offer } from "../components/offer";
import { Link } from "react-router-dom";


export const Home = () => {

  const [user, setUser] = useState([]);
  const [usernameData, setUsername] = useState();
  const dispatch = useDispatch();
  let customer = useSelector(
    (state: { customer: Customer | null }) => state.customer
  );
  const usernameLength = 8; // Length of the username portion of the email
  let username = Array.from({ length: usernameLength }, () => Math.random().toString(36)[2]).join('');

  let getCustomer = async (email: string) => {
    // helper function to get a customer by email
  
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

  let createGuest = async (username:string) => {
    
    let response = await fetch("http://localhost:2800/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 0,
        firstName: "guest",
        lastName: "user",
        email: username,
        password: "guestuser",
      }),
    });
    let data = await response.json();
    console.log(data);
    setUsername(data.email)
  };

  useEffect(() => {
    loadUser();
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      deleteGuest(username); // Perform cleanup or other necessary actions before the user exits the application
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const loadUser = async () => {
    
    if (!customer) {
        createGuest(username);
        let data = await getCustomer(username);
        if(data)
        {
          dispatch({ type: "SET_CUSTOMER", payload: data });
          //setUser(data);
        }
     //}
    }
  };



  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< RETURNED COMPONENT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  return (
    <div>
      <section style={{ position: "relative" }}>
        <video src={bgvideo} autoPlay loop muted />
        <div>
          {customer && customer.firstName !== 'guest' ?(
            <div className={styles.content}>
              <h1 style={{marginBottom: '10px'}}>Welcome back,{capitalizeFirstLetter(customer?.firstName)}!</h1>
              <p>Explore our newest collection of lightweight Pima cotton T-shirts.</p>
              <Link to='/products'>
                <Button variant="secondary">Shop now</Button>
              </Link>
            </div>
          ) : (
            <div className={styles.content}>
              <span></span>
              <h1 style={{marginBottom: '20px'}}>Summer attitude.</h1>
              <p>Explore our newest collection of lightweight Pima cotton T-shirts.</p>
              <Link to='/products'>
                <Button variant="secondary">Shop now</Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      <Offer />
    </div>
  );
};

export default React.memo(Home);
