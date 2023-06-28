import express from 'express';
import { Request, Response }  from 'express';
import {productsrouter} from "./products/product.route";
import {customerRouter} from "./customers/customer.route";
import {cartRouter} from "./cart/cart.route";


const app = express();
const PORT = 2800;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(productsrouter)
app.use(customerRouter);
app.use(cartRouter);

app.get("/", (req, res) => res.send("Server: Hello World!"));

// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads.

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
//   res.header('Access-Control-Allow-Headers', '*')
//   next()
// })


// For invalid routes
app.get("*", (req: Request, res: Response) => {
    res.send("404! This is an invalid URL.");
  });


app.listen(PORT, function () {
    console.log("Server listening on Port", PORT);
  });
 
