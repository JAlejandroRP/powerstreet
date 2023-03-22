import React from "react"
import Box from '@mui/material/Box'
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Details = ({ document, modified }) => {
    const [expanded, setExpanded] = React.useState('panel1')

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false)
    }

    return (
        <Box>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Document details
                    </Typography>
                    {/* <Typography sx={{ color: 'text.secondary' }}>Count of changes: {document.historial_cambios.length}</Typography> */}
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Autor: {document.autor.nombre}
                    </Typography>
                    <Typography>
                        Created: {document.fecha_creacion}
                    </Typography>
                    <Typography>
                        Last modified: {modified.modifiedOn}
                    </Typography>
                    <Typography>
                        Last editor: {modified.modifiedBy}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            {/* <Divider component="div" role="presentation">
                <Typography variant="h6">Details</Typography>
            </Divider> */}
            {/* <Typography variant="body2">Autor:</Typography> */}
            {/* <Typography variant="body2">Created: {document.fecha_creacion}</Typography> */}
            {/* <Typography variant="body2">Last modified:{modified.modifiedOn}</Typography> */}
            {/* <Typography variant="body2">Last editor: {modified.modifiedBy}</Typography> */}
        </Box>
    )
}

export default Details