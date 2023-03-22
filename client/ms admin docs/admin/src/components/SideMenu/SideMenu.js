import React from "react";
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from "@mui/material/Drawer";
import DocSelect from "../SearchInput/SearchInput.js";
import { Typography } from "@mui/material";

const drawerWidth = 240;
const SideMenu = ({ docsTitles, handleDocClick }) => {

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: {
                    xl: 'flex',
                    lg: 'flex',
                    md: 'flex',
                    sm: 'none',
                    xs: 'none'
                },
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <DocSelect
                    titles={docsTitles}
                    onDocClick={async (e) => await handleDocClick(e)}
                />
                <Typography 
                sx={{paddingLeft: '20px'}}
                variant="body">Docs found: {docsTitles.length}</Typography>
            </Box>
        </Drawer>
    )
}

export default SideMenu