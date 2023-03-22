import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const MyNavbar = ({ onLogout, user }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = async () => setAnchorEl(null)

    return (
        <AppBar position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Admin docs
                </Typography>

                <div>
                    <Button color="inherit"
                        onClick={(e) => handleMenu(e)}
                    >{user && user.nombre}</Button>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={onLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>)
}

export default MyNavbar