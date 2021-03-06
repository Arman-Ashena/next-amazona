import { Step, StepLabel, Stepper } from '@material-ui/core';

import React from 'react';
import useStyle from '../utils/styles';

export default function CheckOutWizard({ activeStep = 0 }) {
  const classes = useStyle();
  return (
    <div>
      <Stepper
        className={classes.transparentBackground}
        activeStep={activeStep}
        alternativeLabel
      >
        {['Login', 'Shipping Address', 'Payment Methode', 'Place Order'].map(
          (step) => (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          )
        )}
      </Stepper>
    </div>
  );
}
