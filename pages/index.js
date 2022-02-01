import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@material-ui/core';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import db from '../utils/db';
import Product from '../models/Product';
import Cookies from 'js-cookie';

export default function Home(props) {
  console.log('qw', Cookies.get('userInfo'));
  const { products } = props;
  return (
    <Layout>
      <div>
        <h1>Products</h1>

        <Grid container spacing={3}>
          {products.map((item) => (
            <Grid item md={4} key={item.name}>
              <Card>
                <NextLink href={`/product/${item.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      image={item.image}
                      title={item.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{item.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>${item.price}</Typography>
                  <Button size="small" color="primary">
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();

  await db.disconnect();
  return {
    props: { products: products.map(db.convertDocToObj) },
  };
}
