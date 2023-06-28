import React, { useState, useEffect } from "react";
import { IProduct } from "../models/models";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import { ProductItem } from "../components/ProductItem";
import { Col, Row, Card, Container} from "react-bootstrap"
import { NavLink } from "react-router-dom";
import styles from '../components/gStyle.module.css'

const categories = ['hoodies','sweaters','tshirts','women','men','black','red','white'];
type Filter = {
  category: string[];
  color: string[];
  gender: string[];
};

const initialFilters: Filter = {
  category: [],
  color: [],
  gender: [],
};

export function Productlist() {

  const [filters, setFilters] = useState<Filter>(initialFilters);
  const [products, setProducts] = useState<IProduct[]>([]);
  const navigate = useNavigate();


 
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get('http://localhost:2800/products', { params: filters });
      setProducts(data);
      
    };
    fetchProducts();
    let url = '/products';
    if (filters.category.length > 0) {
      url += `?category=${filters.category.join(',')}`;
    }
    if (filters.color.length > 0) {
      url += `?color=${filters.color.join(',')}`;
    }
    if(filters.gender.length > 0) {
      url += `?gender=${filters.gender.join(',')}`;
    }
    navigate(url);
  }, [filters, navigate]);

  console.log(products);


  const updateFilters = (checked: boolean, filterType: keyof Filter, value: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (checked) {
        newFilters[filterType] = [...newFilters[filterType], value];
      } else {
        newFilters[filterType] = newFilters[filterType].filter((filter) => filter !== value);
      }
      return newFilters;
    });
  };
console.log(filters);


return (
  <>
   <Row className=" mt-4">
    <Container className="col-lg-3 col-md-4 col-12">
    <Card style={{ width: '10rem' }} className=" mt-4">
      <Card.Body>
        <Card.Title style={{ fontWeight: 'bold', fontStyle: 'italic',fontSize:'12px'}}>Shop by category</Card.Title>
        <div className={styles.checkboxRow}>
   
        <label className={styles.title}>
              <input
                type="checkbox"
                value="hoodies"
                checked={filters.category.includes('hoodies')}
                onChange={(e) => updateFilters(e.target.checked, 'category', e.target.value)}
                className={styles.checkbox}
              />
              Hoodies
        </label>
        <label className={styles.title}>
          <input
            type="checkbox"
            value="sweaters"
            checked={filters.category.includes('sweaters')}
            onChange={(e) => updateFilters(e.target.checked, 'category', e.target.value)}
          />
          Sweaters
        </label>
        <label className={styles.title}>
          <input
            type="checkbox"
            value="tshirts"
            checked={filters.category.includes('tshirts')}
            onChange={(e) => updateFilters(e.target.checked, 'category', e.target.value)}
          />
          T-shirts
        </label>
        </div>
        </Card.Body>
        </Card>


      <Card style={{ width: '10rem' }} className=" mt-4">
       <Card.Body>
         <Card.Title style={{ fontWeight: 'bold', fontStyle: 'italic',fontSize:'12px'}}>Shop by gender</Card.Title>
         <div className={styles.checkboxRow}>
         <label className={styles.title}>
          <input
            type="checkbox"
            value="men"
            checked={filters.gender.includes('men')}
            onChange={(e) => updateFilters(e.target.checked, 'gender', e.target.value)}
          />
          Men
        </label>
        <label className={styles.title}>
          <input
            type="checkbox"
            value="women"
            checked={filters.gender.includes('women')}
            onChange={(e) => updateFilters(e.target.checked, 'gender', e.target.value)}
          />
          Women
        </label>
        </div>
        </Card.Body>
        </Card>


       <Card style={{ width: '10rem' }} className=" mt-4">
       <Card.Body>
         <Card.Title style={{ fontWeight: 'bold', fontStyle: 'italic',fontSize:'12px'}}>Shop by color</Card.Title>
         <div className={styles.checkboxRow}>
         <label className={styles.title}>
          <input
            type="checkbox"
            value="black"
            checked={filters.color.includes('black')}
            onChange={(e) => updateFilters(e.target.checked, 'color', e.target.value)}
          />
          Black
        </label>

        <label className={styles.title}>
          <input
            type="checkbox"
            value="red"
            checked={filters.color.includes('red')}
            onChange={(e) => updateFilters(e.target.checked, 'color', e.target.value)}
          />
          Red
        </label>

        <label className={styles.title}>
          <input
            type="checkbox"
            value="white"
            checked={filters.color.includes('white')}
            onChange={(e) => updateFilters(e.target.checked, 'color', e.target.value)}
          />
          White
        </label>
        </div>
        </Card.Body>
        </Card>
    
    </Container>
    
    
    <Container className="col-lg-9 col-md-8 col-12">
     <div className="d-flex flex-wrap">
        {products.map((prod) => {
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
    </Row>



 </>
);
}




