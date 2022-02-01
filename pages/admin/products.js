import axios from 'axios';
import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import React, { useContext, useReducer, useEffect } from 'react';
import { Store } from '../../utils/store';
import { getError } from '../../utils/error';
import Layout from '../../components/Layout';
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import useStyle from '../../utils/styles';
import NextLink from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload, error: '' };
    case 'FETCH_FAILED':
      return { ...state, error: action.payload, loading: false };
    default:
      state;
  }
}

function AdminProducts() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  Chart.register(CategoryScale);

  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    products: [],
  });

  useEffect(() => {
    if (!userInfo) {
      Router.push('/login');
    }

    async function fetchData() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data, status } = await axios.get('/api/admin/products', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(error) });
      }
    }
    fetchData();
  }, []);

  const classes = useStyle();
  return (
    <>
      <Layout title={`Product History`}>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Admin Dashboard"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/orders" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Orders"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/products" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/users" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Users"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography>Products</Typography>
                </ListItem>
              </List>
              <List>
                <ListItem>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography className={classes.error}>{error}</Typography>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Brand</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Count</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product._id}>
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.price}</TableCell>
                              <TableCell>{product.brand}</TableCell>
                              <TableCell>{product.rating}</TableCell>
                              <TableCell>{product.count}</TableCell>
                              <TableCell>
                                <NextLink
                                  href={`/admin/product/${product._id}`}
                                  passHref
                                >
                                  <Button size="small" variant="contained">
                                    Edit
                                  </Button>
                                </NextLink>
                                <Button size="small" variant="contained">
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

export default dynamic(() => Promise.resolve(AdminProducts), { ssr: false });
