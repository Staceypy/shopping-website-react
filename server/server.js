"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_route_1 = require("./products/product.route");
const customer_route_1 = require("./customers/customer.route");
const cart_route_1 = require("./cart/cart.route");
const app = (0, express_1.default)();
const PORT = 2800;
const cors = require('cors');
app.use(cors());
app.use(express_1.default.json());
app.use(product_route_1.productsrouter);
app.use(customer_route_1.customerRouter);
app.use(cart_route_1.cartRouter);
app.get("/", (req, res) => res.send("Server: Hello World!"));
// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads.
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
//   res.header('Access-Control-Allow-Headers', '*')
//   next()
// })
// For invalid routes
app.get("*", (req, res) => {
    res.send("404! This is an invalid URL.");
});
app.listen(PORT, function () {
    console.log("Server listening on Port", PORT);
});
