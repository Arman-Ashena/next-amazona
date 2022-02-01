import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import User from '../../../../../models/User';
import db from '../../../../../utils/db';

const handler = nc();

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.slug = req.body.slug;
    user.image = req.body.image;
    user.category = req.body.category;
    user.price = req.body.price;
    user.count = req.body.count;
    user.description = req.body.description;
    user.brand = req.body.brand;
    await user.save();
    await db.disconnect();
    res.send({ message: 'user Updated Successfully' });
  } else {
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);

  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: 'User Deleted' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'User not find' });
  }
});

export default handler;
