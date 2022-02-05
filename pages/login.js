import {
  ListItem,
  TextField,
  Typography,
  List,
  Button,
  Link,
} from '@material-ui/core';
import React, { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import useStyle from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/store';
import Cookies from 'js-cookie';
import { useForm, Controller } from 'react-hook-form';

export default function Login() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const classes = useStyle();

  const router = useRouter();
  const { redirect } = router.query;
  const { dispatch, state } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);

  const submitHandler = async ({ email, password }) => {
    try {
      const { data } = await axios.post('/api/users/login/', {
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));

      router.push(redirect || '/');
    } catch (error) {
      alert(error);
      console.log('userSubmit', error);
    }
  };
  return (
    <Layout title="login">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="email"
                  inputProps={{ type: 'email' }}
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
                required: true,
                minLength: 6,
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
                      ? errors.password.type === 'minLength'
                        ? 'password length is more than 5'
                        : 'Password is Rquired'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Login
            </Button>
          </ListItem>
          <ListItem>
            Dont have an Acount? &nbsp;
            <NextLink href={`register?redirect=${redirect || '/'}`} passHref>
              <Link>Register </Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
