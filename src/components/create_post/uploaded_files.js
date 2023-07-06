import { url } from "../../App";

import { Box } from "@mui/system"

import { HighlightOffRounded } from '@mui/icons-material';


export function UploadedFiles({ image, onDelete }) {
    return (
        <Box
            className='imgBlock'
            sx={{
                position: 'relative'
            }}
        >
            <img
                src={url + image.url}
                key={image._id}
                style={{
                    maxWidth: '200px',
                    margin: '5px'
                }}
            />

            <HighlightOffRounded
                style={{
                    position: 'absolute',
                    top: '7px',
                    right: '7px',
                    color: 'rgba(238, 238, 238, 0.8)',
                    fontSize: '25px',
                    cursor: 'default'
                }}
                onClick={() => onDelete(image)}
            />
        </Box>
    )
} 