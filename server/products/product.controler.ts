import { ModelManager } from "../model/model-manager"
import { Request, Response } from "express"
import { Product } from "./product.model"
const PRODUCTS_FILE = "./products.json";

export async function getOffer(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Product, number>(PRODUCTS_FILE);
    let allProducts = await modelMgr.getAll();
    let offerProducts = allProducts.filter((p) => p.tags.includes("offer"));
    return res.json(offerProducts);
  } catch (error:any) {
    res.status(400).send(error.message);
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    let modelMgr = new ModelManager<Product, number>(PRODUCTS_FILE);
    let allProducts = await modelMgr.getAll();
    const { category, color, gender } = req.query;
    //console.log(category);
    //console.log(color);
    //console.log(req.query);
    if (category) {
      let categoryArray: string[] = [];
      if (typeof category === 'string') {
        categoryArray.push(category);
      } else if (Array.isArray(category)) {
        categoryArray = category as string[];
      }
      allProducts = allProducts.filter((p) => {
        return categoryArray.some((c) => p.tags.includes(c)) });
        // if at least one element in categoryArray satisfies

    }
    if (color) {
      let colorArray: string[] = [];
      if (typeof color === 'string') {
        colorArray.push(color);
      } else if (Array.isArray(color)) {
        colorArray = color as string[];
      }
      allProducts = allProducts.filter((p) => {
      return colorArray.some((c) => p.tags.includes(c)) });
      // if at least one element in colorArray satisfies

    }
    if (gender) {
      let genderArray: string[] = [];
      if (typeof gender === 'string') {
        genderArray.push(gender);
      } else if (Array.isArray(gender)) {
        genderArray = gender as string[];
      }
      allProducts = allProducts.filter((p) => {
        return genderArray.some((c) => p.tags.includes(c)) });
        // if at least one element in genderArray satisfies
    }
    return res.json(allProducts);
  } catch (error:any) {
    res.status(400).send(error.message);
  }
    
}

export async function getProduct(req: Request, res: Response) {
    try {
        let modelMgr = new ModelManager<Product, number>(PRODUCTS_FILE);
        let id = parseInt(req.params.id);
        let product = await modelMgr.getByID(id);
        res.json(product);
        console.log(product)
      } catch (error:any) {
        // res.statusMessage=
        res.status(400).send(error.message);
      }
}



// export function getProduct(req, res) {
//   return new Promise((resolve, reject) => {
//     try {
//       let modelMgr = new ModelManager<Product, number>(PRODUCTS_FILE);
//       let id = parseInt(req.params.id);
//       modelMgr.getByID(id)
//         .then((product) => {
//           res.json(product);
//           console.log(product);
//           resolve();
//         })
//         .catch((error) => {
//           res.status(400).send(error.message);
//           reject(error);
//         });
//     } catch (error) {
//       res.status(400).send(error.message);
//       reject(error);
//     }
//   });
// }

