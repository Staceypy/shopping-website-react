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
exports.deleteCustomer = exports.postCustomer = exports.getCustomerByEmail = void 0;
const model_manager_1 = require("../model/model-manager");
const CUSTOMERS_FILE = "./customers.json";
const CART_FILE = "./cart.json";
function getCustomerByEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(CUSTOMERS_FILE);
            let email = req.params.email;
            let id = hashString(email);
            let customer = yield modelMgr.getByID(id);
            res.json(customer);
        }
        catch (error) {
            // res.statusMessage=
            res.status(400).send(error.message);
        }
    });
}
exports.getCustomerByEmail = getCustomerByEmail;
function postCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(CUSTOMERS_FILE);
            let newCustomerID = hashString(req.body.email);
            let newCustomer = req.body;
            newCustomer.id = newCustomerID;
            yield modelMgr.add(newCustomer);
            let cartMgr = new model_manager_1.ModelManager(CART_FILE);
            let newCart = { id: newCustomerID, items: [] };
            yield cartMgr.add(newCart);
            res.status(200).json({
                status: "OK",
            });
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.postCustomer = postCustomer;
function deleteCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let modelMgr = new model_manager_1.ModelManager(CUSTOMERS_FILE);
            let id = hashString(req.params.email);
            yield modelMgr.remove(id);
            let cartMgr = new model_manager_1.ModelManager(CART_FILE);
            yield cartMgr.remove(id);
            res.status(200).json({
                status: "OK. Customer & cart deleted.",
            });
        }
        catch (error) {
            res.status(400).json({
                error: { message: error.message },
            });
        }
    });
}
exports.deleteCustomer = deleteCustomer;
const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    hash = Math.abs(hash); // Ensure hash code is positive
    return hash;
};
