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
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import useStyle from '../../utils/styles';
import NextLink from 'next/link';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summary: action.payload, error: '' };
    case 'FETCH_FAILED':
      return { ...state, error: action.payload, loading: false };
    default:
      state;
  }
}

function AdminDashboard() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  Chart.register(CategoryScale);

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    summary: { salesData: [] },
  });

  useEffect(() => {
    if (!userInfo) {
      Router.push('/login');
    }

    async function fetchData() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data, status } = await axios.get('/api/admin/summary', {
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
                  <ListItem selected button component="a">
                    <ListItemText primary="Admin Dashboard"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/orders" passHref>
                  <ListItem button component="a">
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
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <Typography className={classes.error}>{error}</Typography>
                  ) : (
                    <Grid container spacing={4}>
                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1">
                              ${summary.ordersPrice}
                            </Typography>
                            <Typography>Sales</Typography>
                          </CardContent>
                          <CardActions>
                            <NextLink href="admin/orders" passHref>
                              <Button size="small" color="primary">
                                View Sales
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>
                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1">
                              {summary.ordersCount}
                            </Typography>
                            <Typography>Orders</Typography>
                          </CardContent>
                          <CardActions>
                            <NextLink href="/admin/orders" passHref>
                              <Button color="primary" size="small">
                                View Orders
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>

                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1">
                              {summary.productsCount}
                            </Typography>
                            <Typography>Products</Typography>
                          </CardContent>
                          <CardActions>
                            <NextLink href="/admin/products" passHref>
                              <Button color="primary" size="small">
                                View Products
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>
                      <Grid item md={3}>
                        <Card raised>
                          <CardContent>
                            <Typography variant="h1">
                              {summary.usersCount}
                            </Typography>
                            <Typography>Users</Typography>
                          </CardContent>
                          <CardActions>
                            <NextLink href="/admin/users" passHref>
                              <Button color="primary" size="small">
                                View Users
                              </Button>
                            </NextLink>
                          </CardActions>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </ListItem>
                <ListItem>
                  <Typography component="h1" variant="h1">
                    Sales Chart
                  </Typography>
                </ListItem>
                <ListItem>
                  <Bar
                    data={{
                      labels: summary.salesData.map((x) => x._id),
                      datasets: [
                        {
                          label: 'Sales',
                          backgroundColor: 'rgba(162,222,208,1)',
                          data: summary.salesData.map((x) => x.totalSales),
                        },
                      ],
                    }}
                    options={{ legend: { display: true, position: 'right' } }}
                  ></Bar>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
