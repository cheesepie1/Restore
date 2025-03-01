import { Button, Menu, Fade, MenuItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useState } from "react";
import { user } from "../models/user";
import { History, Logout, Person } from "@mui/icons-material";
import { useLogoutMutation } from "../../features/account/accountApi";
import { Link } from "react-router-dom";

type Props = {
    user: user
}

export default function UserMenu({ user }: Props) {
    const [logout] = useLogoutMutation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                onClick={handleClick}
                color="inherit"
                size="large"
                sx={{ fontSize: '1.1rem' }}
            >
                {user.email}
            </Button>
            <Menu
                id="fade-menu"
                MenuListProps={{
                    'aria-labelledby': 'fade-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
            >
                <MenuItem >
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>
                        My Profile
                    </ListItemText>
                </MenuItem>

                <MenuItem component={Link} to='/Orders'>
                    <ListItemIcon>
                        <History />
                    </ListItemIcon>
                    <ListItemText>
                        My Orders
                    </ListItemText>
                </MenuItem>
                <Divider />

                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>
                        Logout
                    </ListItemText>

                </MenuItem>
            </Menu>
        </div>
    );
}