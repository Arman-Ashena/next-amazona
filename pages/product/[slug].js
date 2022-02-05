import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import data from '../../utils/data';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import useStyles from '../../utils/styles';
import Image from 'next/image';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/store';
import axios from 'axios';
import { route } from 'next/dist/server/router';

export default function ProductScreen(props) {
  const { product } = props;
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState();

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  if (!product) {
    return <div>Product Not Found </div>;
  }
  const route = useRouter();

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${product._id}/reviews`);
      setReviews(data);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const addToCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.count <= 0) {
      window.alert('sorry. the product is out of stock');
    }
    dispatch({ type: 'CARD_ADD_ITEM', payload: { ...product, quantity: 1 } });
    route.push('/cart');
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      setLoading(false);
      alert('Add Review Successfully');
      fetchReviews();
    } catch (error) {
      setLoading(false);
      alert(error);
    }
  };

  const classes = useStyles();
  return (
    <Layout title={product.name} description={product.description}>
      <div className={classes.section}>
        <NextLink href="/" passHref>
          <Link>
            <Typography>Back to Products</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={600}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={3} xs={12}>
          <List>
            <ListItem>
              <Typography component="h1" variant="h1">
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography> Category: {product.category}</Typography>
            </ListItem>

            <Typography>
              <ListItem>Brand: {product.brand}</ListItem>
            </Typography>

            <ListItem>
              <Rating value={product.rating} readOnly></Rating>
              <Link href="#reviews">
                <Typography>({product.numReviews} Reviews)</Typography>
              </Link>
            </ListItem>

            <Typography>
              <ListItem>Description: {product.description}</ListItem>
            </Typography>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Price</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>${product.price}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.count > 0 ? 'In Stock' : 'Unavailable'}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={addToCartHandler}
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
      <List>
        <ListItem>
          <Typography name="reviews" id="reviews" variant="h2">
            Customer reviews
          </Typography>
        </ListItem>
        {reviews.length === 0 && <ListItem> No Review</ListItem>}
        {reviews.map((review) => (
          <ListItem key={review._id}>
            <Grid container>
              <Grid item className={classes.reviewItem}>
                <Typography>
                  <strong> {review.name} </strong>
                </Typography>
                <Typography>{review.createdAt.substring(0, 10)} </Typography>
              </Grid>
              <Grid item>
                <Rating value={review.rating} readOnly></Rating>
                <Typography>{review.comment}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
        <ListItem>
          {userInfo ? (
            <form onSubmit={submitHandler} className={classes.reviewForm}>
              <List>
                <ListItem>
                  <Typography variant="h2">Leave your Review Here</Typography>
                </ListItem>
                <ListItem>
                  <TextField
                    multiline
                    variant="outlined"
                    fullWidth
                    name="review"
                    label="Enter Comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></TextField>
                </ListItem>
                <ListItem>
                  <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  ></Rating>
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    fullWidth
                    color="primary"
                    variant="contained"
                  >
                    Submit
                  </Button>
                  {loading && <CircularProgress></CircularProgress>}
                </ListItem>
              </List>
            </form>
          ) : (
            <Typography>
              Please{' '}
              <Link href={`/login?redirect=/product/${product.slug}`}>
                Login{' '}
              </Link>
              to write a review
            </Typography>
          )}
        </ListItem>
      </List>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  //get rid of field reviews from fetching Product data from database
  const product = await Product.findOne({ slug }, '-reviews').lean();
  await db.disconnect();
  return {
    props: { product: db.convertDocToObj(product) },
  };
}
