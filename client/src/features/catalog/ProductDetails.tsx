import { useParams } from "react-router-dom"
import { Product } from "../../app/modules/product";
import { useEffect, useState } from "react";
import { Button, Divider, Grid2, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(error => console.log(error))


    }, [id]);
    if (!product) return <div>Loading...</div>

    const productDetails = [
        { lable: 'Name', value: product.name },
        { lable: 'Description', value: product.description },
        { lable: 'Type', value: product.type },
        { lable: 'Brand', value: product.brand },
        { lable: 'Quantity in stock', value: product.quantityInStock }
    ]
    return (
        <Grid2 container spacing={6} maxWidth='lg' sx={{ mx: 'auto' }}>
            <Grid2 size={6}>
                <img src={product?.pictureUrl} alt={product.name} style={{ width: '100%' }} />
            </Grid2>
            <Grid2 size={6}>
                <Typography variant='h3'>
                    {product.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h4" color="secondary">${(product.price / 100).toFixed(2)}</Typography>

                <TableContainer>

                    <Table sx={{'& td': {fontSize: '1rem'}}}>
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
                <Grid2 container spacing={2} marginTop={3}>
                    <Grid2 size={6}>
                        <TextField
                            variant="outlined"
                            type="number"
                            label='Quanty in basket'
                            fullWidth
                            defaultValue={1}

                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <Button
                        sx={{height: '55px'}}
                            color='primary'
                            size='large'
                            variant='contained'
                            fullWidth
                        >
                            Add to Basket
                        </Button>

                    </Grid2>
                </Grid2>
            </Grid2>
        </Grid2>
    )
}