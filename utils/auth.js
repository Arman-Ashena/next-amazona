import jwt from 'jsonwebtoken';

const signToken = (user) => {
  // because this is void method we should use return statement.
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

//simular to expressjs middleware
const isAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Token is not Valid' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'Token is not Supplied' });
  }
};

//before calling this middleware,we should call isAuth middleware: handler.use(isAuth,isAdmin)
const isAdmin = async (req, res, next) => {
  //we accesss to req.user becase of the isAuth middleware
  if (req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'User is not Admin' });
  }
};
export { signToken, isAuth, isAdmin };
