import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import {Row,Card, Col,Container,Form,Button} from "react-bootstrap"
import { IProduct } from "../models/models";
import styles from "../components/gStyle.module.css"
import { useShoppingCart } from "../context/CartContext";
import { CartFill } from 'react-bootstrap-icons';



export function ProductDescription(){
    const { id } = useParams();
    console.log(id);
    const [product, setProduct] =useState<IProduct>();
    const { addToCart } = useShoppingCart();
    const [quantity, setQuantity] = useState<number>(1);


    useEffect(() => {
        const fetchProduct = async () => {
          try {
            const response = await axios.get(`http://localhost:2800/products/${id}`);
            setProduct(response.data);
          } catch (error) {
            console.error(error);
          }
        };
    
        fetchProduct();
      }, []);
    
      if (!product) {
        return <p>Loading...</p>;
      }
    
      return (
        <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={12}>
            <Card border="0">
              <div className="row">
                <div className="col-md-4">
                  <Card.Img className={styles.Pimage} src={product.imgurl} alt="Product Image" />
                </div>
                <div className="col-md-8">
                  <Card.Body>
                    <Card.Title className={styles.Ptitle}>{product.productName}</Card.Title>
                    <br/>
                    <Card.Text className={styles.Ptext}>Price: {product.price}dkk</Card.Text>
                    <Card.Text className={styles.Ptext}>Description: {product.description}</Card.Text>
                    <br/>
                    <br/>
                  
                    <Form.Group className="mt-5">
                    <Row>
                        <div className="col-6">
                        <Form.Control type="number" id={`inputquantity-${product.id}`} name="quantity" value={quantity} min={1} 
                        style={{ width: '100px' }} 
                        onChange={(event) =>
                            setQuantity(parseInt(event.target.value))} />
                        </div>
                        <div className="col-6">
                        <Button type="button" className="btn btn-sm btn-light btn-outline-dark {styles.cardfont}" onClick={() => addToCart(product.id, quantity)}>
                            <span>Add to cart</span>
                        </Button>
                        </div>
                    </Row>
                    </Form.Group>
                  </Card.Body>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      );
    }