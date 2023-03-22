import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

export default function DocSelect({ onDocClick, titles }) {
    // titles.unshift({id: '0', title: 'new doc'})
    // const limitedTitles = titles.slice(0, 5)
    // limitedTitles.push({id: '0', title: 'new doc'})
    const handleDocClick = (option) => {
        // if (label.toLowerCase() === 'new doc')
        onDocClick(option)
        // console.log(label)
    }

    // console.log(titles);
    return (
        <Autocomplete
            id="select"
            sx={{ m: 1, marginTop: '50px'}}
            filterOptions={createFilterOptions({
                limit: 6,
            })}
            options={titles}
            // autoHighlight
            getOptionLabel={(option) => option.title}
            renderOption={(props, option) => (
                <Typography
                    onClick={() => handleDocClick(option)}
                    sx={{
                        paddingLeft: '15px',
                        cursor: 'pointer'
                    }}
                    key={option.id}
                    variant="body" display="block" gutterBottom>
                    {option.title}
                </Typography>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Docs search"
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                    }}
                />
            )}
        />
    );
}
