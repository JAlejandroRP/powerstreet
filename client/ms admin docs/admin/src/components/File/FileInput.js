import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';

function FileUploadSingle({ onLoad, enqueueSnackbar}) {
    const handleFileChange = async (e) => {
        if (e.target.files
            && e.target.files.length == 1) {
            const file = e.target.files[0]
            if(!file.name.includes('.txt'))
                return enqueueSnackbar('just .txt files!', 'error', 2000 )
            const reader = new FileReader()
            console.log(file);
            reader.readAsText(file)

            reader.onload = async () => {
                onLoad(file.name, reader.result)
                enqueueSnackbar('file uploaded correctly!', 'success', 2000 )
            }

            reader.onerror = function () {
                enqueueSnackbar('an error ocurred!', 'error', 2000 )
                console.log(reader.error);
            }
        }
    };

    return (
        <Button
            color='secondary'
            variant='outlined'
            component="label"
        >
            Upload File
            <input
                value={''}
                onChange={handleFileChange}
                type="file"
                hidden
            />
        </Button>
    )
}

export default FileUploadSingle;