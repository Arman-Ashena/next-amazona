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
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@material-ui/core';
import useStyle from '../utils/styles';
import NextLink from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

function Profile() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      Router.push('/login');
    }
    setValue('name', userInfo.name);
    setValue('email', userInfo.email);
  }, []);
  const classes = useStyle();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    if (password != confirmPassword) {
      alert('Not Equal');
      return;
    }
    try {
      const { data } = await axios.put(
        '/api/users/profile/',
        {
          name,
          email,
          password,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );

      dispatch({ type: 'USER_LOGIN', payload: data });
      alert('Profile Updated Successfully');
      Cookies.set('userInfo', JSON.stringify(data));
    } catch (error) {
      getError(error);
      console.log(getError(error));
    }
  };

  return (
    <>
      <Layout title={`Profile`}>
        <Grid container spacing={1}>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <NextLink href="/profile" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="User Profile"></ListItemText>
                  </ListItem>
                </NextLink>
                <NextLink href="/orderHistory" passHref>
                  <ListItem button component="a">
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
                    Profile
                  </Typography>
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
                              onChange={(e) => setEmail(e.target.value)}
                              inputProps={{ type: 'text' }}
                              error={Boolean(errors.name)}
                              helperText={
                                errors.name
                                  ? errors.name.type === 'pattern'
                                    ? 'Name is not valid'
                                    : 'Name is Rquired'
                                  : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="email"
                          control={control}
                          defaultValue=""
                          rules={{
                            required: true,
                            pattern:
                              /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="email"
                              label="email"
                              inputProps={{ type: 'text' }}
                              error={Boolean(errors.email)}
                              helperText={
                                errors.email
                                  ? errors.email.type === 'pattern'
                                    ? 'Email is not valid'
                                    : 'Email is Rquired'
                                  : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="password"
                          control={control}
                          defaultValue=""
                          rules={{
                            validate: (value) =>
                              value === '' ||
                              value.length > 5 ||
                              'Password length is more than 5',
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="password"
                              label="password"
                              inputProps={{ type: 'password' }}
                              error={Boolean(errors.password)}
                              helperText={
                                errors.password
                                  ? 'Password is more than 5 '
                                  : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Controller
                          name="confirmPassword"
                          control={control}
                          defaultValue=""
                          rules={{
                            validate: (value) =>
                              value === '' ||
                              value.length > 5 ||
                              'Confirm Password length is more than 5',
                          }}
                          render={({ field }) => (
                            <TextField
                              variant="outlined"
                              fullWidth
                              id="confirmPassword"
                              label="confirmPassword"
                              inputProps={{ type: 'password' }}
                              error={Boolean(errors.confirmPassword)}
                              helperText={
                                errors.password
                                  ? 'confirmPassword is more than 5'
                                  : ''
                              }
                              {...field}
                            ></TextField>
                          )}
                        ></Controller>
                      </ListItem>
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          fullWidth
                        >
                          Updatte
                        </Button>
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

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
