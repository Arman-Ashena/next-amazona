import nc from 'next-connect';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
  // this code return all Products without filter: find({})
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

export default handler;
