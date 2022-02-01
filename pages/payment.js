import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { mergeClasses } from '@material-ui/styles';
import Cookies from 'js-cookie';
import { Router, useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import CheckOutWizard from '../components/checkOutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/store';
import useStyle from '../utils/styles';

export default function Payment() {
  const { state, dispatch } = useContext(Store);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const {
    cart: { shippingAddress },
  } = state;
  const router = useRouter();
  useEffect(() => {
    if (!shippingAddress) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);
  const classes = useStyle();
  const submitHandler = (e) => {
    e.preventDefault();

    if (!paymentMethod) alert('paymenthode required');
    else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      localStorage.setItem('paymentMethod', paymentMethod);
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeOrder');
    }
  };
  return (
    <>
      <Layout title="Payment Method">
        <CheckOutWizard activeStep={2}></CheckOutWizard>
        <form className={classes.form} onSubmit={submitHandler}>
          <Typography component="h1" variant="h1">
            Payment Method
          </Typography>
          <List>
            <ListItem>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="Payment Method"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    label="PayPal"
                    value="PayPal"
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="Stripe"
                    value="Stripe"
                    control={<Radio />}
                  ></FormControlLabel>
                  <FormControlLabel
                    label="Cash"
                    value="Cash"
                    control={<Radio />}
                  ></FormControlLabel>
                </RadioGroup>
              </FormControl>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                type="submit"
                color="primary"
                variant="contained"
              >
                Continue
              </Button>
            </ListItem>
            <ListItem>
              <Button
                type="button"
                fullWidth
                variant="contained"
                onClick={() => router.push('/shipping')}
              >
                Back
              </Button>
            </ListItem>
          </List>
        </form>
      </Layout>
    </>
  );
}
