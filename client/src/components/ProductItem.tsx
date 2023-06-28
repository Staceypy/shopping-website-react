import React from 'react';
import { Col, Card, Image, Form, Button } from 'react-bootstrap';
import { useContext, useState } from "react";
import { useShoppingCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import styles from './header.module.css'
import { CartFill } from 'react-bootstrap-icons';


type ProductItemProps = {
    id: number
    productName: string
    price: number
    imgurl: string
}

export function ProductItem({id, productName: name, price, imgurl}: ProductItemProps) {
    const [quantity, setQuantity] = useState<number>(1);
    const { addToCart } = useShoppingCart();

    // const handleCart = () => {
    //     //event.preventDefault(); // Prevent page reload on submit
    //     addToCart(id, quantity);
    //     setQuantity(1);
    //   };

    return (
        <Col lg={4} md={6} xs={12}>
          <Card  style={{ width: '15rem' }}>
            <div className="product-img {styles.cardimg}">
              <Link to={`/products/${id}`}>
                <Image className="default-img card-img-top" src={imgurl} alt="#"  />
              </Link>
            </div>
    
            <Card.Footer>
              <Form.Group>
              
                <div>
                <Link to={`/products/${id}`}>
                  <Form.Label className={styles.cardfont}>{name}</Form.Label>
                </Link>
                </div>
                <Form.Label className={styles.prizefont}>Price: {price}</Form.Label>
                <div className="row">
                  <div className="col-9">
                    <Form.Control type="number" id={`inputquantity-${id}`} name="quantity" value={quantity} min={1} 
                    style={{ width: '80px' }} 
                    onChange={(event) =>
                        setQuantity(parseInt(event.target.value))} />
                  </div>
                  <div className="col-3">
                    <Button type="button" className="btn btn-sm btn-light btn-outline-dark {styles.cardfont}" onClick={() => addToCart(id, quantity)}>
                    
                      <CartFill />
                    </Button>
                  </div>
                </div>
                
              </Form.Group>
            </Card.Footer>
          </Card>
        </Col>
      )
    
}