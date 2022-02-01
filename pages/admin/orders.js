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
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAILED':
      return { ...state, error: action.payload, loading: false };
    default:
      state;
  }
}

function AdminOrders() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  Chart.register(CategoryScale);

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    orders: [],
  });

  useEffect(() => {
    if (!userInfo) {
      Router.push('/login');
    }

    async function fetchData() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data, status } = await axios.get('/api/admin/orders', {
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
      <Layout title={`Order History`}>
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
                  <ListItem selected button component="a">
                    <ListItemText primary="Orders"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/products" passHref>
                  <ListItem button component="a">
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
                  <Typography>Orders</Typography>
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
                            <TableCell>ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>User</TableCell>
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
                              <TableCell>
                                {order.user ? order.user.name : 'DELETED USER'}
                              </TableCell>
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

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
