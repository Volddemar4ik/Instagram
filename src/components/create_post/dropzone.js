// import React, {
//     useCallback,
//     useMemo
// } from 'react'

// import { useDropzone } from 'react-dropzone'

// import { Box, Stack } from '@mui/system';

// const baseStyle = {
//     flex: 1,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '30px',
//     borderWidth: 2,
//     borderRadius: 2,
//     borderColor: '#eeeeee',
//     borderStyle: 'dashed',
//     backgroundColor: '#fafafa',
//     color: '#bdbdbd',
//     outline: 'none',
//     transition: 'border .24s ease-in-out'
// };

// const focusedStyle = {
//     borderColor: '#2196f3'
// };

// const acceptStyle = {
//     borderColor: '#00e676'
// };

// const rejectStyle = {
//     borderColor: '#ff1744'
// };


// export function StyledDropzone({ onFiles }) {
//     const onDrop = useCallback(acceptedFiles => {
//         onFiles(acceptedFiles)
//     }, [])

//     const {
//         getRootProps,
//         getInputProps,
//         isFocused,
//         isDragAccept,
//         isDragReject
//     } = useDropzone({ onDrop, accept: { 'image/*': [] } });

//     const style = useMemo(() => ({
//         ...baseStyle,
//         ...(isFocused ? focusedStyle : {}),
//         ...(isDragAccept ? acceptStyle : {}),
//         ...(isDragReject ? rejectStyle : {})
//     }), [
//         isFocused,
//         isDragAccept,
//         isDragReject
//     ]);

//     return (
//         <Box sx={{
//             width: '100%',
//             marginTop: '20px',
//             marginBottom: '20px'
//         }}>
//             <div className="container">
//                 <div {...getRootProps({ style })}>
//                     <input {...getInputProps()} className='getphoto' />
//                     <p>Перетащите или добавьте, кликнув сюда, файлы</p>
//                 </div>
//             </div>
//         </Box>
//     );
// }


import React, {
    useCallback,
    useMemo
} from 'react'

import { useDropzone } from 'react-dropzone'

import { Box, Stack } from '@mui/system';

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '30px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};


export function StyledDropzone({ onFiles }) {
    const onDrop = useCallback(acceptedFiles => {
        onFiles(acceptedFiles)
    }, [])

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    return (
        <Box sx={{
            width: '100%',
            marginTop: '20px',
            marginBottom: '20px'
        }}>
            <div className="container">
                <div {...getRootProps({ style })}>
                    <input {...getInputProps()} className='getphoto' />
                    <p>Перетащите или добавьте, кликнув сюда, файлы</p>
                </div>
            </div>
        </Box>
    );
}