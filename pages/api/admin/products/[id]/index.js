import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
});

handler.put(async (req, res) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.image = req.body.image;
    product.category = req.body.category;
    product.price = req.body.price;
    product.count = req.body.count;
    product.description = req.body.description;
    product.brand = req.body.brand;
    await product.save();
    await db.disconnect();
    res.send({ message: 'product Updated Successfully' });
  } else {
  }
});
export default handler;
