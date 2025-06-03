import { Add, Close, Remove } from "@mui/icons-material"
import { Item } from "../../app/models/basket"
import { Grid, IconButton, Paper, Typography, Box } from "@mui/material"
import { useAddBasketItemMutation, useRemoveBasketItemMutation } from "./basketApi"
import { currencyFormat } from "../../lib/util"

type Props = {
    item: Item
}

export default function BasketItem({ item }: Props) {
    const [removeBasketItem] = useRemoveBasketItemMutation();
    const [addBasketItem] = useAddBasketItemMutation();

    return (
        <Paper
            sx={{
                borderRadius: 3,
                mb: 2,
                p: 2,
                flexGrow: 1
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3} display="flex" justifyContent="center">
                    <Box
                        component="img"
                        src={item.pictureUrl}
                        alt={item.name}
                        sx={{
                            width: { xs: 80, sm: 100 },
                            height: { xs: 80, sm: 100 },
                            objectFit: "cover",
                            borderRadius: 2
                        }}
                    />
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                        {item.name}
                    </Typography>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        mt={1}
                        gap={1}
                    >
                        <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {currencyFormat(item.price)} x {item.quantity}
                        </Typography>
                        <Typography color="primary" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {currencyFormat(item.price * item.quantity)}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <IconButton
                            onClick={() => removeBasketItem({ productId: item.productId, quantity: 1 })}
                            color="error" size="small" sx={{ border: 1, borderRadius: 1 }}
                        >
                            <Remove />
                        </IconButton>
                        <Typography variant="body1">{item.quantity}</Typography>
                        <IconButton
                            onClick={() => addBasketItem({ product: item, quantity: 1 })}
                            color="success" size="small" sx={{ border: 1, borderRadius: 1 }}
                        >
                            <Add />
                        </IconButton>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={1} display="flex" justifyContent={{ xs: "flex-end", sm: "center" }}>
                    <IconButton
                        onClick={() => removeBasketItem({ productId: item.productId, quantity: item.quantity })}
                        color="error"
                        size="small"
                        sx={{ border: 1, borderRadius: 1 }}
                    >
                        <Close />
                    </IconButton>
                </Grid>
            </Grid>
        </Paper>
    )
}
