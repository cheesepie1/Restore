import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { AppBar, IconButton, ListItem, Toolbar, Typography, List, Badge, Box, LinearProgress } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { useFetchBasketQuery } from "../../features/basket/basketApi";
import UserMenu from "./UserMenu";
import { useUserInfoQuery } from "../../features/account/accountApi";
import { useMediaQuery, useTheme } from "@mui/material";

const midLinks = [
    { title: 'catalog', path: '/catalog' },
    { title: 'about', path: '/about' },
    { title: 'contact', path: '/contact' },
]
const rightLinks = [
    { title: 'login', path: '/login' },
    { title: 'register', path: '/register' }
]
const navStyles = {

    color: 'inherit',
    typography: 'h6',
    // textDecoration: 'none',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: ' #baecf9'
    }
}

export default function NavBar() {

    // fetch user information
    const { data: user } = useUserInfoQuery();

    // get loading state and dark mode preference from the Redux store
    const { isLoading, darkMode } = useAppSelector(state => state.ui);
    const dispatch = useAppDispatch();

    // fetch the user's shopping basket using a query hook
    const { data: basket } = useFetchBasketQuery();

    // calculate the total number of items in the existing basket, or set it 0 
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="fixed">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center'>
                    <Typography
                        component={NavLink}
                        to='/'
                        variant="h6"
                        sx={{
                            ...navStyles,
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        RE-STORE
                    </Typography>

                    <IconButton onClick={() => dispatch(setDarkMode())}>
                        {darkMode ? <DarkMode /> : <LightMode sx={{ color: 'yellow' }} />}
                    </IconButton>

                </Box>
                {!isMobile && (
                    <List sx={{ display: 'flex' }}>
                        {midLinks.map(({ title, path }) => (
                            <ListItem
                                component={NavLink}
                                to={path}
                                key={path}
                                sx={navStyles}
                            >
                                {title.toUpperCase()}

                            </ListItem>
                        ))}
                    </List>
                )}

                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='/basket' size="large" sx={{ color: 'inherit' }}>
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />

                        </Badge>
                    </IconButton>
                    {user ? (
                        <UserMenu user={user} />
                    ) : (
                        <List sx={{ display: 'flex' }}>
                            {rightLinks.map(({ title, path }) => (
                                <ListItem
                                    component={NavLink}
                                    to={path}
                                    key={path}
                                    sx={{
                                        ...navStyles,
                                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' }  // 添加响应式字体大小
                                    }}

                                >
                                    {title.toUpperCase()}

                                </ListItem>
                            ))}
                        </List>
                    )}

                </Box>


            </Toolbar>
            {isLoading && (
                <Box sx={{ width: '100%' }}>
                    <LinearProgress color="primary" />
                </Box>
            )}
        </AppBar>
    )
}