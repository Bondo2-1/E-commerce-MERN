import express from "express"
import { addProduct, getAllProducts } from "../services/productServices"

const router = express.Router()

router.get('/',async (req,res) => {
    try {
        const products = await getAllProducts();
        res.status(200).send(products);
    } catch (err) {
        res.status(500).send("something went wrong");
    }
})

router.post('/addproduct', async (req,res) =>{
    try {
        const {title, image, price, stock} = req.body;
        const {statusCode,data} = await addProduct({title, image, price, stock});
        res.status(statusCode).send(data);
    } catch (err) {
        res.status(500).send("something went wrong");
    }
})
export default router
