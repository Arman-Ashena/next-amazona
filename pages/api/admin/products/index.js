import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import { encodeBase64 } from "bcryptjs";

const handler = nc();

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: "",
    slug: "",
    image: "/images/yourImage.jpg",
    price: 0,
    category: "",
    brand: "",
    count: 0,
    description: "",
    rating: 0,
    numReviews: 0,
  });
  const product = await newProduct.save();
  db.disconnect();
  res.send({ message: "Product Created", product });
});

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
