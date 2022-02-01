import nc from 'next-connect';
import Order from '../../../models/Order';
import { isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import { onError } from '../../../utils/error';

const handler = nc({
  onError: onError,
});
//this is a middleware.this middleware has a return value and send this value to the next middleware.
//return value is: req.user = verified user by token
handler.use(isAuth);

// only authenticated user can access to this api
handler.get(async (req, res) => {
  await db.connect();
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

export default handler;
