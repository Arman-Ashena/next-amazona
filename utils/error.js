import db from './db';

const getError = (err) => {
  console.log('error', err.response);
  err.response && err.response?.data && err.response?.data?.message
    ? err.response.data.message //errors comming from backend
    : err.message; // normal error
};

const onError = async (err, req, res, next) => {
  await db.disconnect();
  res.status(500).send({ message: err.toString() });
};

export { getError, onError };
