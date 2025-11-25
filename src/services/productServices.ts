import { productModel } from "../models/productModel";

interface productparams{
    title:string,
    image:string,
    price:number,
    stock:number
}
export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  const products = [
    { title: "laptop 1", image: "image1.jpg", price: 30000, stock: 5 },
    { title: "laptop 2", image: "image2.jpg", price: 50000, stock: 2 },
    //{ title: "Product 3", image: "", price: 30, stock: 3 },
    //{ title: "Product 4", image: "", price: 40, stock: 4 },
    //{ title: "Product 5", image: "", price: 50, stock: 5 },
    //{ title: "Product 6", image: "", price: 60, stock: 6 },
    //{ title: "Product 7", image: "", price: 70, stock: 7 },
    //{ title: "Product 8", image: "", price: 80, stock: 8 },
    //{ title: "Product 9", image: "", price: 90, stock: 9 },
  ];
  const productsDummy = await getAllProducts();
  if (productsDummy.length === 0) {
    await productModel.insertMany(products);
  }
};

/////////////////// add product.
export const addProduct = async ({title,image,price,stock}:productparams) => {
    const findProduct = await productModel.findOne({ title });
    if (findProduct){
          return { data: "product already exisit", statusCode: 400 };
    }
    const newProduct = new productModel({title,image,price,stock});
    await newProduct.save()
    return { data: `Product added to database: ${JSON.stringify({ title, image, price, stock })}`, statusCode: 200 };
}

