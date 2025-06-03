import { useParams } from "react-router-dom"
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useFetchProductDetailsQuery } from "./catalogApi";
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from "../basket/basketApi";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductDetails() {
    const { id } = useParams();
    const [removeBasketItem] = useRemoveBasketItemMutation();
    const [addBasketItem] = useAddBasketItemMutation();
    // Find if this product already exists in the basket
    const { data: basket } = useFetchBasketQuery();
    const item = basket?.items.find(x => x.productId === +id!);
    const [quantity, setQuantity] = useState(1);

    // Sync quantity with basket if item is already in basket
    useEffect(() => {
        if (item) setQuantity(item.quantity);
    }, [item]);


    const { data: product, isLoading } = useFetchProductDetailsQuery(id ? +id : 0)
    if (!product || isLoading) return <div>Loading...</div>

    const handleUpdateBasket = () => {
        const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity;
        // If item is new or quantity increased, add items； otherwise, remove some from basket
        if (!item || quantity > item.quantity) {
            addBasketItem({ product, quantity: updatedQuantity })
        } else {
            removeBasketItem({ productId: product.id, quantity: updatedQuantity })
        }
    }
    // Handle input change for quantity
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = +event.currentTarget.value;
        if (value >= 0) setQuantity(value)
    }

    const productDetails = [
        { lable: 'Name', value: product.name },
        { lable: 'Description', value: product.description },
        { lable: 'Type', value: product.type },
        { lable: 'Brand', value: product.brand },
        { lable: 'Quantity in stock', value: product.quantityInStock }
    ]
    return (
        <Grid container spacing={6}   sx={{
            mx: 'auto',
            maxWidth: { xs: '100%', sm: '600px', md: '900px', lg: '1200px' },
            px: { xs: 2, sm: 3, md: 4 }
          }}>
            <Grid item xs={12} md={6}>
                <img src={product?.pictureUrl} alt={product.name} style={{ width: '80%' }} />
            </Grid>
            <Grid item xs={12} md={6} >
                <Typography variant='h3' sx={{
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                    textAlign: { xs: 'center', md: 'left' }
                }}>
                    {product.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h4" color="secondary" sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, textAlign: { xs: 'center', md: 'left' } }}>
                    ${(product.price / 100).toFixed(2)}
                </Typography>

                <TableContainer >

                    <Table sx={{ '& td': { fontSize: { xs: '0.8rem', md: '1rem' } } }}>
                        <TableBody>

                            {productDetails.map((detail, index) => (
                                <TableRow key={index}>

                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {detail.lable}

                                    </TableCell>
                                    <TableCell>
                                        {detail.value}
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>

                </TableContainer>
                <Grid container spacing={2} marginTop={3} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            type="number"
                            label='Quanty in basket'
                            fullWidth
                            value={quantity}
                            onChange={handleInputChange}

                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            onClick={handleUpdateBasket}
                            disabled={quantity === item?.quantity || !item && quantity === 0}
                            sx={{ height: '55px' }}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth
                        >
                            {item ? 'Update quantity' : 'Add to basket'}
                        </Button>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}