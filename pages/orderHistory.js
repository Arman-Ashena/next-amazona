import axios from 'axios';
import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import React, { useContext, useReducer, useEffect } from 'react';
import { Store } from '../utils/store';
import { getError } from '../utils/error';
import Layout from '../components/Layout';
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
import useStyle from '../utils/styles';
import NextLink from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAILED':
      return { ...state, error: action.payload, loading: false };
    default:
      state;
  }
}

function OrderHistory() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();

  const [{ loading, orders, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    orders: [],
  });

  useEffect(() => {
    if (!userInfo) {
      Router.push('/login');
    }

    async function fetchOrders() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/orders/history', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(error) });
      }
    }
    fetchOrders();
  }, []);
  const classes = useStyle();
  return (
    <>
      <Layout title={`Order History`}>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/profile" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="User Profile"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/orderHistory" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Order History"></ListItemText>
                  </ListItem>
                </NextLink>
              </List>
            </Card>
          </Grid>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Order History
                  </Typography>
                </ListItem>
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
                            <TableCell>ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Delivered</TableCell>
                            <TableCell>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                {order._id.substring(20, 24)}
                              </TableCell>
                              <TableCell>{order.createAt}</TableCell>
                              <TableCell>${order.totalPrice}</TableCell>
                              <TableCell>
                                {order.isPaid
                                  ? `paid at ${order.paidAt}`
                                  : 'not paid'}
                              </TableCell>
                              <TableCell>{order.createAt}</TableCell>
                              <TableCell>
                                <NextLink href={`/order/${order._id}`}>
                                  <Button variant="contained">Details</Button>
                                </NextLink>
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

export default dynamic(() => Promise.resolve(OrderHistory), { ssr: false });
