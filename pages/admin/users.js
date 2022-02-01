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
      return { ...state, loading: false, users: action.payload, error: '' };
    case 'FETCH_FAILED':
      return { ...state, error: action.payload, loading: false };
    case 'DELETE_REQUEST':
      return { ...state, error: '', loadingDelete: true };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}

function AdminUsers() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  Chart.register(CategoryScale);

  const [{ loading, error, users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: false,
      error: '',
      users: [],
    });

  useEffect(() => {
    if (!userInfo) {
      router.push('/login');
    }

    async function fetchData() {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data, status } = await axios.get('/api/admin/users', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAILED', payload: getError(error) });
      }
    }
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (userId) => {
    if (!window.confirm('Are u sure?')) {
      return;
    } else {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/admin/users/${userId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
        alert('user deleted successfully');
      } catch (error) {
        dispatch({ type: 'DELETE_FAIL' });
        alert(error);
      }
    }
  };

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
                  <ListItem button component="a">
                    <ListItemText primary="Products"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/admin/users" passHref>
                  <ListItem selected button component="a">
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
                  <Typography>Users</Typography>
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
                            <TableCell>NAME</TableCell>
                            <TableCell>EMAIL</TableCell>
                            <TableCell>ISADMIN</TableCell>
                            <TableCell>ACTIONS</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user._id}>
                              <TableCell>{user._id}</TableCell>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                {user.isAdmin ? 'YES' : 'NO'}
                              </TableCell>

                              <TableCell>
                                <NextLink
                                  href={`/admin/user/${user._id}`}
                                  passHref
                                >
                                  <Button size="small" variant="contained">
                                    Edit
                                  </Button>
                                </NextLink>
                                <Button
                                  onClick={() => deleteHandler(user._id)}
                                  size="small"
                                  variant="contained"
                                >
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

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
