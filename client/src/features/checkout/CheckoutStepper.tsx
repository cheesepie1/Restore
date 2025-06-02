import { Box, Button, Checkbox, FormControlLabel, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react"
import Review from "./Review";
import { useFetchAddressQuery, useUpdateUserAddressMutation } from "../account/accountApi";
import { ConfirmationToken, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/util";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useCreateOrderMutation } from "../orders/orderApi";

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutStepper() {
    const [createOrder] = useCreateOrderMutation();
    const { basket } = useBasket();
    const [activeStep, setActiveStep] = useState(0);
    const { data, isLoading } = useFetchAddressQuery();
    const [updateAddress] = useUpdateUserAddressMutation();
    const [saveAddressChecked, setSaveAddressChecked] = useState(false);
    const elements = useElements();
    const [addressComplete, setAddressCompleted] = useState(false);
    const [paymentComplete, setPaymentCompleted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { total, clearBasket } = useBasket();
    const navigate = useNavigate();
    const stripe = useStripe();
    const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);
    
    // Destructure name and rest of address from fetched user data
    let name, restAddress;
    if (data) {
        ({name, ...restAddress} = data);
    }

    // Move to next step or handle final submission
    const handleNext = async () => {
        if (activeStep === 0 && saveAddressChecked && elements) {
            const address = await getStripeAddress();
             // Save address to user account
            if (address) await updateAddress(address);
        }
        if (activeStep == 1) {
            if (!elements || !stripe) return;
            // Validate payment form
            const result = await elements.submit();
            if (result.error) return toast.error(result.error.message);

            // Create a confirmation token for the payment
            const stripeResult = await stripe.createConfirmationToken({ elements });
            if (stripeResult.error) return toast.error(stripeResult.error.message);
            setConfirmationToken(stripeResult.confirmationToken);
        }
        if (activeStep === 2) {
            // Final step: confirm the payment and place the order
            await confirmPayment();
        }
        // Go to next step if not finished
        if (activeStep < 2) setActiveStep(step => step + 1);
    }

    // Confirm Stripe payment and create order
    const confirmPayment = async () => {
        setSubmitting(true);
        try {
            if (!confirmationToken || !basket?.clientSecret)
                throw new Error('Unable to process payment');

            // Prepare order data and send it to backend
            const orderModel = await createOrderModel();
            const orderResult = await createOrder(orderModel);

            // Confirm payment using Stripe SDK
            const paymentResult = await stripe?.confirmPayment({
                clientSecret: basket.clientSecret,
                redirect: 'if_required',
                confirmParams: {
                    confirmation_token: confirmationToken.id
                }
            });
            if (paymentResult?.paymentIntent?.status === 'succeeded') {
                navigate('/checkout/success', { state: orderResult });
                // Clear cart after checking out sucessfiully
                clearBasket();
            }
            else if (paymentResult?.error) {
                throw new Error(paymentResult.error.message);
            }
            else {
                throw new Error('Somethhing went wrong!');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
            // Go back if failing
            setActiveStep(step => step - 1);

        }
        finally {
            setSubmitting(false);
        }
    }

    // Create order model from Stripe data
    const createOrderModel = async () => {
        const shippingAddress = await getStripeAddress();
        const paymentSummary = confirmationToken?.payment_method_preview.card;
        if (!shippingAddress || !paymentSummary) throw new Error('Problem creating order');
        return { shippingAddress, paymentSummary }
    }

     // Extract address info from Stripe AddressElement
    const getStripeAddress = async () => {
        const addressElement = elements?.getElement('address');
        if (!addressElement) return null;
        const { value: { name, address } } = await addressElement.getValue();
        if (name && address) return { ...address, name };

        return null;
    }

     // Go to previous step
    const handleBack = () => {
        setActiveStep(step => step - 1);
    }
    const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
        setAddressCompleted(event.complete)
    }
    const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
        setPaymentCompleted(event.complete)
    }


    if (isLoading) return <Typography variant="h6"> Loading checkout...</Typography>
    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    return (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
                    <AddressElement
                        options={{
                            mode: 'shipping',
                            defaultValues: {
                                name: name,
                                address: restAddress
                            }
                        }}
                        onChange={handleAddressChange}
                    />
                    <FormControlLabel
                        sx={{ display: 'flex', justifyContent: 'end' }}
                        control={<Checkbox
                            checked={saveAddressChecked}
                            onChange={e => setSaveAddressChecked(e.target.checked)}

                        />}
                        label='Save as dedault address'
                    />

                </Box>
                <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
                    <PaymentElement onChange={handlePaymentChange} />

                </Box>
                <Box sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
                    <Review confirmationToken={confirmationToken} />
                </Box>
            </Box>
            <Box display='flex' paddingTop={2} justifyContent='space-between'>
                <Button onClick={handleBack}>Back</Button>
                <LoadingButton
                    onClick={handleNext}
                    disabled={
                        (activeStep == 0 && !addressComplete) ||
                        (activeStep == 1 && !paymentComplete) ||
                        submitting
                    }
                    loading={submitting}
                >
                    {activeStep === steps.length - 1 ? `Pay${currencyFormat(total)}` : 'Next'}
                </LoadingButton>

            </Box>

        </Paper>
    )
}


