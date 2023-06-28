import { useState, useEffect } from 'react';
import { Row, Col, Container} from 'react-bootstrap';
import { ProductItem } from './ProductItem';
import { IProduct } from "../models/models";
import styles from '../components/hero.module.css';


export function Offer() {
    const [offers, setOffer] = useState<IProduct[]>([]);

    useEffect(() => {
        getAllItems();
      }, []);

    const getAllItems = async () => {
        try {
          const response = await fetch(`http://localhost:2800/offer`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setOffer(data);
          } else {
            console.log("An error occurred while fetching offer items");
          }
        } catch (error) {
          console.error("An error occurred while fetching offer items:", error);
        }
      };
    return (
            <Container className="col-lg-9 col-md-8 col-12">
                <hr></hr>
                <Row> <h2 style={{marginBottom: "1rem"}}>LIMITED OFFER!</h2> </Row>
                <Row> <p>
                  <span style={{fontSize: "1.2rem"}}>
                  Up to 30% discount on selected basic items for new or existing members.
                  </span>
                  </p> </Row>
            <div className="d-flex flex-wrap">
                {offers.map((prod) => {
                return (
                    <Container className="col-lg-4 col-md-6 col-12">
                    <div className=" m-3" style={{ width: '400px' }} key={prod.id}>
                    <Col key={prod.id}>
                    <ProductItem {...prod} />
                    </Col>
                    </div>
                </Container>
                );
                })}
            </div>
            </Container>
    );

}