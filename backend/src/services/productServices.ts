import { productModel } from "../models/productModel";

interface productparams {
  title: string;
  image: string;
  price: number;
  stock: number;
}
export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  const products = [
    {
      title: "asus laptop",
      image:
        "https://m.media-amazon.com/images/I/61+9ew81AfL._AC_UF1000,1000_QL80_.jpg",
      price: 15000,
      stock: 5,
    },
    {
      title: "dell laptop",
      image:
        "https://dlcdnwebimgs.asus.com/gain/4cc342ab-c4fa-42a9-8619-a340f6119bec/w800",
      price: 40000,
      stock: 3,
    },
    {
      title: "hp laptop",
      image:
        "https://www.hp.com/gb-en/shop/Html/Merch/Images/c06723377_1750x1285.jpg",
      price: 45000,
      stock: 10,
    },
    //{ title: "Product 4", image: "", price: 40, stock: 4 },
    //{ title: "Product 5", image: "", price: 50, stock: 5 },
    //{ title: "Product 6", image: "", price: 60, stock: 6 },
    //{ title: "Product 7", image: "", price: 70, stock: 7 },
    //{ title: "Product 8", image: "", price: 80, stock: 8 },
    //{ title: "Product 9", image: "", price: 90, stock: 9 },
  ];
  const existingCount = await productModel.countDocuments();
  if (existingCount === 0) {
    await productModel.insertMany(products);
  } 
};

/////////////////// add product.
export const addProduct = async ({
  title,
  image,
  price,
  stock,
}: productparams) => {
  const findProduct = await productModel.findOne({ title });
  if (findProduct) {
    return { data: "product already exisit", statusCode: 400 };
  }
  const newProduct = new productModel({ title, image, price, stock });
  await newProduct.save();
  return { data: { title, image, price, stock }, statusCode: 200 };
  //return { data: `Product added to database: ${JSON.stringify({ title, image, price, stock })}`, statusCode: 200 };
};
