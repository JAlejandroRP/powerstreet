import { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';

function FileUploadSingle({ onLoad }) {
    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files.length == 1) {
            const file = e.target.files[0]
            const reader = new FileReader()
            console.log(file);
            reader.readAsText(file)

            reader.onload = async () => {
                onLoad(file.name, reader.result)
            }

            reader.onerror = function () {
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