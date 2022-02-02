import axios from 'axios';
import dynamic from 'next/dynamic';
import { Router, useRouter } from 'next/router';
import React, { useContext, useReducer, useEffect, useState } from 'react';
import { Store } from '../../../utils/store';
import { getError } from '../../../utils/error';
import Layout from '../../../components/Layout';
import {
  Button,
  Card,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import useStyle from '../../../utils/styles';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
        error: '',
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: '',
      };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case 'UPDATE_REQUEST':
      return {
        ...state,
        loadingUpdate: true,
        errorUpdate: '',
      };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: '',
      };
    case 'UPDATE_FAIL':
      return {
        ...state,
        loadingUpdate: false,
        errorUpdate: action.payload,
      };

    default:
      state;
  }
};

function UserEdit({ params }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = params.id;
  const { state } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
  });

  useEffect(() => {
    if (!userInfo) {
      Router.push('/login');
    }
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/users/${userId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setIsAdmin(data.isAdmin);
        dispatch({ type: 'FETCH_SUCCESS' });
        setValue('name', data.name);
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', error: getError(error) });
      }
    };
    fetchData();
  }, []);
  const classes = useStyle();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name }) => {
    try {
      dispatch({ type: 'UPDATE_REQUEST' });

      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      alert('User Updated Successfully');
      router.push('/admin/users');
    } catch (error) {
      getError(error);
      console.log(getError(error));
      dispatch({ type: 'UPDATE_FAIL', payload: getError(error) });
    }
  };

  return (
    <>
      <Layout title={`Update User ${userId}`}>
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
                  <Typography component="h1" variant="h1">
                    Edit User {userId}
                  </Typography>
                </ListItem>
                <ListItem>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    error && (
                      <Typography className={classes.error}>{error}</Typography>
                    )
                  )}
                </ListItem>
                <ListItem>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    className={classes.form}
                  >
                    <List>
                      <ListItem>
                        <Controller
                          name="name"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="name"
                              label="name"
                              error={Boolean(errors.name)}
                              helperText={errors.name ? 'Name is Rquired' : ''}
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <FormControlLabel
                          label="Is Admin"
                          control={
                            <Checkbox
                              onClick={(e) => setIsAdmin(e.target.checked)}
                              checked={isAdmin}
                              name="isAdmin"
                            ></Checkbox>
                          }
                        ></FormControlLabel>
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          fullWidth
                        >
                          Update
                        </Button>
                        {loadingUpdate && <CircularProgress></CircularProgress>}
                      </ListItem>
                    </List>
                  </form>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
