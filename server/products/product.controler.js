"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProduct = exports.getAllProducts = exports.getOffer = void 0;
const model_manager_1 = require("../model/model-manager");
const PRODUCTS_FILE = "./products.json";
function getOffer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(PRODUCTS_FILE);
            let allProducts = yield modelMgr.getAll();
            let offerProducts = allProducts.filter((p) => p.tags.includes("offer"));
            return res.json(offerProducts);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    });
}
exports.getOffer = getOffer;
function getAllProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(PRODUCTS_FILE);
            let allProducts = yield modelMgr.getAll();
            const { category, color, gender } = req.query;
            //console.log(category);
            //console.log(color);
            //console.log(req.query);
            if (category) {
                let categoryArray = [];
                if (typeof category === 'string') {
                    categoryArray.push(category);
                }
                else if (Array.isArray(category)) {
                    categoryArray = category;
                }
                allProducts = allProducts.filter((p) => {
                    return categoryArray.some((c) => p.tags.includes(c));
                });
                // if at least one element in categoryArray satisfies
            }
            if (color) {
                let colorArray = [];
                if (typeof color === 'string') {
                    colorArray.push(color);
                }
                else if (Array.isArray(color)) {
                    colorArray = color;
                }
                allProducts = allProducts.filter((p) => {
                    return colorArray.some((c) => p.tags.includes(c));
                });
                // if at least one element in colorArray satisfies
            }
            if (gender) {
                let genderArray = [];
                if (typeof gender === 'string') {
                    genderArray.push(gender);
                }
                else if (Array.isArray(gender)) {
                    genderArray = gender;
                }
                allProducts = allProducts.filter((p) => {
                    return genderArray.some((c) => p.tags.includes(c));
                });
                // if at least one element in genderArray satisfies
            }
            return res.json(allProducts);
        }
        catch (error) {
            res.status(400).send(error.message);
        }
    });
}
exports.getAllProducts = getAllProducts;
function getProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(PRODUCTS_FILE);
            let id = parseInt(req.params.id);
            let product = yield modelMgr.getByID(id);
            res.json(product);
            console.log(product);
        }
        catch (error) {
            // res.statusMessage=
            res.status(400).send(error.message);
        }
    });
}
exports.getProduct = getProduct;
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
