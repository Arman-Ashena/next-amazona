import { Grid, Typography } from "@material-ui/core";
import Layout from "../components/Layout";
import NextLink from "next/link";
import db from "../utils/db";
import Product from "../models/Product";
import { Rating } from "@material-ui/lab";
import ProductItem from "../components/ProductItem";
import { useContext } from "react";
import { Store } from "../utils/store";
import axios from "axios";
import { useRouter } from "next/router";

export default function Home(props) {
  const { products } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.count < quantity) {
      alert("sorry. product is out of stock");
      return;
    }
    dispatch({ type: "CARD_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };
  return (
    <Layout>
      <div>
        <h1>Products</h1>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              ></ProductItem>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  //get rid of field reviews from fetching Product data from database
  const products = await Product.find({}, "-reviews").lean();
  await db.disconnect();
  return {
    props: { products: products.map(db.convertDocToObj) },
  };
}
