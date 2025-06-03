import { Grid, Typography } from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary";
import CheckoutStepper from "./CheckoutStepper";
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from "@stripe/react-stripe-js";
import { useFetchBasketQuery } from "../basket/basketApi";
import { useEffect, useMemo, useRef } from "react";
import { useCreatePaymentIntentMutation } from "./CheckoutApi";
import { useAppSelector } from "../../app/store/store";

// Initialize Stripe with the public key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutPage() {
  const { data: basket } = useFetchBasketQuery();
  // Hook to create a payment intent from the backend
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();
  // Ref to make sure createPaymentIntent is only called once
  const created = useRef(false);
  const { darkMode } = useAppSelector(state => state.ui);

  // Create the payment intent when the component first mounts
  useEffect(() => {
    if (!created.current) createPaymentIntent();
    // Ensure it's not called again on re-render
    created.current = true;

  }, [createPaymentIntent])

  // Memoize Stripe Elements options to avoid unnecessary re-renders
  const options: StripeElementsOptions | undefined = useMemo(() => {
    // Only return options if clientSecret exists
    if (!basket?.clientSecret) return undefined;
    return {
      clientSecret: basket.clientSecret,
      appearance: {
        labels: 'floating',
        theme: darkMode ? 'night' : 'stripe'
      }
    }

  }, [basket?.clientSecret, darkMode])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        {!stripePromise || !options || isLoading ? (
          <Typography variant="h6">
            Loading checkout...

          </Typography>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutStepper />
          </Elements>
        )}

      </Grid>
      <Grid item xs={12} md={4}>
        <OrderSummary />

      </Grid>
    </Grid>
  )
}