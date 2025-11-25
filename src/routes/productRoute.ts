import express from "express"
import { addProduct, getAllProducts } from "../services/productServices"

const router = express.Router()

router.get('/',async (req,res) => {
    const products = await getAllProducts();
    res.status(200).send(products);
})

router.post('/addproduct', async (req,res) =>{
    const {title, image, price, stock} = req.body;
    const {statusCode,data} = await addProduct({title, image, price, stock});
    res.status(statusCode).send(data);
})
export default router