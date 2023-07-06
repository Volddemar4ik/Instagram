// import React, {
//     useState,
//     useEffect
// } from 'react';

// import {
//     connect,
//     useDispatch,
//     useSelector
// } from 'react-redux';

// import {
//     useHistory,
//     useParams
// } from "react-router-dom";

// import {
//     Box,
//     TextField,
//     Container,
// } from '@mui/material'

// import Button from '@mui/material-next/Button';

// import SendRoundedIcon from '@mui/icons-material/SendRounded';

// import { StyledDropzone } from './dropzone';
// import { Dnd } from './dnd';
// import { UploadedFiles } from './uploaded_files';

// import {
//     actionFilesUpload,
//     actionFullCreatePost
// } from '../../redux/thunks';
// import { actionFindPostOne } from '../../redux/action';


// export const CreatePost = () => {
//     const history = useHistory()
//     const { postId } = useParams()
//     const dispatch = useDispatch()

//     // запускается, если открылась страница редактирования поста
//     useEffect(() => {
//         if (postId !== 'create') {
//             const getPost = async (id) => {
//                 const res = await dispatch(actionFindPostOne(id))

//                 if (res) {
//                     post._id = postId
//                     setPost({
//                         ...post,
//                         images: [...post.images, ...(res?.images || [])],
//                         title: res?.title,
//                         text: res?.text
//                     })
//                 }
//             }
//             getPost(postId)
//         }
//     }, [postId])


//     // параметры поста для отправки на бек
//     const [post, setPost] = useState({ title: '', text: '', images: [] })

//     // создаем объект с данными из всех форм для отправки на бек
//     const newPostData = ({ ...post, images: ((post.images)?.map(item => ({ _id: item._id }))) })

//     // отслеживаем, когда картинки загрузятся на сервак и отработает промис
//     const images = useSelector(state => state.promise?.FilesUpload?.payload)

//     useEffect((() => {
//         console.log('images', images)
//         if (Array.isArray(images)) {
//             if (images) {
//                 setPost({ ...post, images: [...post.images, ...images] })
//             }
//         }
//     }), [images])

//     // удаление картинки
//     const deleteImage = image => setPost({ ...post, images: post.images.filter(i => i !== image) })

//     const localPostImage = ({ image }) => <UploadedFiles
//         image={image}
//         onDelete={imgToDelete => deleteImage(imgToDelete)}
//     />

//     // const newPost = useSelector(state => state.promise?.CreatePost?.payload?._id)

//     // запрос на бек на создание.редактирование поста
//     async function onSend() {
//         const res = await dispatch(actionFullCreatePost(newPostData));

//         if (res) {
//             history.push(`/post/${res?._id}`);
//         }
//     }


//     return (
//         <Container maxWidth="90%">
//             <Box>
//                 <StyledDropzone
//                     onFiles={files => dispatch(actionFilesUpload(files))}
//                     onPost={post}
//                 />
//             </Box>

//             <Dnd
//                 items={post.images}
//                 render={localPostImage}
//                 itemProp="image"
//                 keyField="_id"
//                 onChange={images => setPost({ ...post, images })}
//                 horizontal
//             />

//             <Box
//                 component="form"
//                 sx={{
//                     '& > :not(style)': { m: 1, width: '100%', marginBottom: '20px' },
//                 }}
//             >
//                 <TextField
//                     id="title"
//                     label="Название поста"
//                     variant="standard"
//                     onChange={e => setPost({ ...post, title: e.target.value })}
//                     value={post.title}
//                 />
//             </Box>

//             <Box
//                 component="form"
//                 sx={{
//                     '& .MuiTextField-root': { m: 1, width: '100%', marginBottom: '20px' },
//                 }}
//             >
//                 <TextField
//                     id="text"
//                     label="Описание поста"
//                     multiline
//                     variant="standard"
//                     onChange={e => setPost({ ...post, text: e.target.value })}
//                     value={post.text}
//                 />
//             </Box>

//             <Container
//                 onClick={onSend}
//                 sx={{
//                     display: 'flex',
//                     justifyContent: 'center'
//                 }}
//             >
//                 <Button
//                     size="medium"
//                     variant="filledTonal"
//                     startIcon={
//                         <SendRoundedIcon
//                             style={{ transform: 'translate(3px, -4px) rotate(-30deg)' }}
//                         />}
//                 >
//                     Опубликовать пост
//                 </Button>
//             </Container>
//         </Container >
//     )
// }



import React, {
    useState,
    useEffect
} from 'react';

import {
    connect,
    useDispatch,
    useSelector
} from 'react-redux';

import {
    useHistory,
    useParams
} from "react-router-dom";

import {
    Box,
    TextField,
    Container,
} from '@mui/material'

import Button from '@mui/material-next/Button';

import SendRoundedIcon from '@mui/icons-material/SendRounded';

import { StyledDropzone } from './dropzone';
import { Dnd } from './dnd';
import { UploadedFiles } from './uploaded_files';

import {
    actionFilesUpload,
    actionFullCreatePost
} from '../../redux/thunks';
import { actionFindPostOne } from '../../redux/action';


export const CreatePost = () => {
    const history = useHistory()
    const { postId } = useParams()
    const dispatch = useDispatch()

    // запускается, если открылась страница редактирования поста
    useEffect(() => {
        if (postId !== 'create') {
            const getPost = async (id) => {
                const res = await dispatch(actionFindPostOne(id))

                if (res) {
                    post._id = postId
                    setPost({
                        ...post,
                        images: [...post.images, ...(res?.images || [])],
                        title: res?.title,
                        text: res?.text
                    })
                }
            }
            getPost(postId)
        }
    }, [postId])


    // параметры поста для отправки на бек
    const [post, setPost] = useState({ title: '', text: '', images: [] })

    // создаем объект с данными из всех форм для отправки на бек
    const newPostData = ({ ...post, images: ((post.images)?.map(item => ({ _id: item._id }))) })

    // отслеживаем, когда картинки загрузятся на сервак и отработает промис
    const images = useSelector(state => state.promise?.FilesUpload?.payload)

    // useEffect((() => {
    //     if (images) {
    //         setPost({ ...post, images: [...post.images, ...images] })
    //     }
    // }), [images])

    useEffect((() => {
        if (Array.isArray(images)) {
            if (images) {
                setPost({ ...post, images: [...post.images, ...images] })
            }
        }
    }), [images])

    // удаление картинки
    const deleteImage = image => setPost({ ...post, images: post.images.filter(i => i !== image) })

    const localPostImage = ({ image }) => <UploadedFiles
        image={image}
        onDelete={imgToDelete => deleteImage(imgToDelete)}
    />

    const newPost = useSelector(state => state.promise?.CreatePost?.payload?._id)

    // запрос на бек на создание.редактирование поста
    async function onSend() {
        const res = await dispatch(actionFullCreatePost(newPostData));

        if (res) {
            history.push(`/post/${res?._id}`);
        }
    }


    return (
        <Container maxWidth="90%">
            <Box>
                <StyledDropzone
                    onFiles={files => dispatch(actionFilesUpload(files))}
                    onPost={post}
                />
            </Box>

            <Dnd
                items={post.images}
                render={localPostImage}
                itemProp="image"
                keyField="_id"
                onChange={images => setPost({ ...post, images })}
                horizontal
            />

            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '100%', marginBottom: '20px' },
                }}
            >
                <TextField
                    id="title"
                    label="Название поста"
                    variant="standard"
                    onChange={e => setPost({ ...post, title: e.target.value })}
                    value={post.title}
                />
            </Box>

            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%', marginBottom: '20px' },
                }}
            >
                <TextField
                    id="text"
                    label="Описание поста"
                    multiline
                    variant="standard"
                    onChange={e => setPost({ ...post, text: e.target.value })}
                    value={post.text}
                />
            </Box>

            <Container
                onClick={onSend}
                sx={{
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <Button
                    size="medium"
                    variant="filledTonal"
                    startIcon={
                        <SendRoundedIcon
                            style={{ transform: 'translate(3px, -4px) rotate(-30deg)' }}
                        />}
                >
                    Опубликовать пост
                </Button>
            </Container>
        </Container >
    )
}