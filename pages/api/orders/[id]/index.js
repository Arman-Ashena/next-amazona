import nc from 'next-connect';
import Order from '../../../../models/Order';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';

const handler = nc();

//only authenticated user can see this page.so:
handler.use(isAuth);

handler.get(async (req, res) => {
  await db.connect();
  // this code return all Products without filter: find({})
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  res.send(order);
});

export default handler;
