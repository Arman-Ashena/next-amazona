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
import { Controller, useForm } from 'react-hook-form';

export default function Register() {
  const {
    handleSubmit,
    control,
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

  const submitHandler = async ({ name, email, password, confirmPassword }) => {
    if (password != confirmPassword) {
      alert('Not Equal');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/register/', {
        name,
        email,
        password,
      });

      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', JSON.stringify(data));
      alert('you register successfully');
      router.push(redirect || '/');
    } catch (error) {
      alert('error');
      console.log(error);
    }
  };
  return (
    <Layout title="register">
      <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
        <Typography component="h1" variant="h1">
          Register
        </Typography>
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
                pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
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
                      ? errors.password.type === 'pattern'
                        ? 'Password is not valid'
                        : 'Password is Rquired'
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
                required: true,
                minLength: 6,
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
                    errors.confirmPassword
                      ? errors.confirmPassword.type === 'pattern'
                        ? 'confirmPassword is not valid'
                        : 'confirmPassword is Rquired'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Register
            </Button>
          </ListItem>
          <ListItem>
            Already have an Acount? &nbsp;
            <NextLink href={`login?redirect=${redirect || '/'}`} passHref>
              <Link>Login</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
