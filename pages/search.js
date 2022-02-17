import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import useStyle from "../utils/styles";
import db from "../utils/db";
import Product from "../models/Product";
import ProductItem from "../components/ProductItem";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../utils/store";
import { Pagination } from "@material-ui/lab";

const PAGE_SIZE = 3;

const prices = [
  { name: "$1 to &50", value: "1-50" },
  { name: "$51 to &200", value: "51-200" },
  { name: "$201 to &1000", value: "201-1000" },
];

const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const classes = useStyle();
  const router = useRouter();
  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
    rating = "all",
    sort = "all",
  } = router.query;

  const { products, countProducts, categories, brands, pages } = props;

  //filterSearch for change the url of the search screen
  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;

    if (page) query.page = page;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (sort) query.sort = sort;
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;
    if (searchQuery) query.searchQuery = searchQuery;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    console.log("wer", path, query);
    router.push({ pathname: path, query: query });
  };

  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const pageHandler = (e, value) => {
    filterSearch({ page: value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };
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
    <Layout title="Search">
      <Grid container className={classes.mt1} spacing={1}>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem value={category} key={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>brands</Typography>
                <Select fullWidth value={brand} onChange={brandHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {brands &&
                    brands.map((brand) => (
                      <MenuItem value={brand} key={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Pricess</Typography>
                <Select fullWidth value={price} onChange={priceHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {prices &&
                    prices.map((price) => (
                      <MenuItem value={price.value} key={price.value}>
                        {price.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>ratings</Typography>
                <Select fullWidth value={rating} onChange={ratingHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {ratings &&
                    ratings.map((rating) => (
                      <MenuItem value={rating} key={rating}>
                        {rating}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item className={classes.root}>
              {products.length === 0 ? "No" : countProducts} Results{" "}
              {query !== "all" && query !== "" && " : " + query}
              {category !== "all" && " : " + category}
              {brand !== "all" && " : " + brand}
              {price !== "all" && " : Price" + price}
              {rating !== "all" && " : Rating" + rating + "&up"}
              {(query !== "all" && query !== "") ||
              category !== "all" ||
              brand !== "all" ||
              rating !== "all" ||
              price != "all" ? (
                <Button onClick={() => router.push("/search")}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item md={3}>
              <Typography component="span" className={classes.root}>
                Sort By :{" "}
              </Typography>
              <Select fullWidth value={sort} onChange={sortHandler}>
                <MenuItem value="Nothing">----</MenuItem>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
                <MenuItem value="toprated">Customer Reviwes</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Grid className={classes.mt1} container spacing={3}>
            {products.map((product) => (
              <Grid item md={3} key={product.name}>
                <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                ></ProductItem>
              </Grid>
            ))}
          </Grid>
          <Grid container md={9} alignItems="center" justifyContent="center">
            <Pagination
              className={classes.mt1}
              variant="outlined"
              color="primary"
              size="large"
              defaultPage={parseInt(query.page || "1")}
              count={pages}
              onChange={pageHandler}
            ></Pagination>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const brand = query.brand || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};

  const brandFilter = brand && brand != "all" ? { brand } : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const ratingFilter =
    rating && rating != "all" ? { rating: { $gte: Number(rating) } } : {};
  const priceFilter =
    price && price != "all"
      ? {
          // price : 10-50
          //compare price with this two filter: gte(greater than) and lte(les than)
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};
  const order =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? //ascending
        { price: 1 }
      : sort === "highest"
      ? //descending
        { price: -1 }
      : sort === "toprated"
      ? //descending
        { rating: -1 }
      : sort === "newest"
      ? //descending
        { createdAt: -1 }
      : //return latest product
        { _id: -1 };

  const categories = await Product.find().distinct("category");
  const brands = await Product.find().distinct("brand");
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    "-reviews"
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  //calculate the legth of records
  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });
  await db.disconnect();
  const products = productDocs.map(db.convertDocToObj);
  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}
