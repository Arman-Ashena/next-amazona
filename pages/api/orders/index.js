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
handler.post(async (req, res) => {
  await db.connect();
  const newOrder = new Order({
    ...req.body,
    user: req.user._id,
  });

  const order = await newOrder.save();
  res.status(201).send(order);
});

export default handler;
