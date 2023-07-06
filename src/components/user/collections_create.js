import { url } from '../../App';

import { useState, useEffect, useContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';


import {
    Container,
    Stack,
    TextField,
    Typography,
    ImageList,
    ImageListItem,
    Box,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import Button from '@mui/material-next/Button';

import { CollectionsBookmarkRounded } from '@mui/icons-material'

import {
    actionFullCreateCollection,
    actionFullFindCollections
} from '../../redux/thunks';

import { CollectionContext } from './collections';
import { dark } from '@mui/material/styles/createPalette';


// стили чекбокса
const iconStyle = {
    position: 'absolute',
    right: '-7px',
    top: '-7px',
    color: '#6750a4',
    '&.Mui-checked': {
        color: '#6750a4',
    }
}

export default function CreateCollection() {
    const dispatch = useDispatch()

    // контекст управления модальным окном создания коллекции
    const [openCreateCollection, setOpenCreateCollection] = useContext(CollectionContext)

    const userPosts = useSelector(state => state?.collection?.PostListCollection?.payload)
    // console.log('userPosts: ', userPosts)

    // состояние данных для создания новой коллекции
    const [collection, setCollection] = useState({ text: '', posts: [] })

    // влючение/отключение кнопки создания коллекции
    const [collectionButton, setCollectionButton] = useState(true)

    // проверка заполненности данных при создании коллекции
    useEffect(() => {
        if (collection.text !== '' && collection.posts.length !== 0) {
            setCollectionButton(false)
        } else {
            setCollectionButton(true)
        }
    }, [collection])

    // состояние чекбоксов постов
    const [checkedItems, setCheckedItems] = useState({});

    // отслеживание чекбокса на поста
    const handleCheckboxChange = (itemId) => {
        setCheckedItems(prevState => ({ ...prevState, [itemId]: !prevState[itemId] }))
    }

    // дбавление поста в список для коллекции
    useEffect(() => {
        let newPosts = []
        for (const [key, value] of Object.entries(checkedItems)) {
            if (value) {
                newPosts.push({ _id: key })
            }
        }
        setCollection({ ...collection, posts: [...newPosts] })
    }, [checkedItems])


    // запрос на создание коллекции
    function createCollection() {
        if (!collectionButton) {
            dispatch(actionFullCreateCollection(collection)).then(res => {
                if (res) {
                    setOpenCreateCollection(false)

                    dispatch(actionFullFindCollections(res?.owner?._id))
                }
            })
        }
    }



    return (
        <Stack spacing={2}>
            <Container>
                <TextField
                    label='Введите название новой коллекции'
                    variant='standard'
                    size='small'
                    fullWidth
                    onChange={e => setCollection({ ...collection, text: e.target.value })}
                />
            </Container>

            <Container
                onClick={createCollection}
                sx={{
                    margin: '0 auto',
                    width: 'fit-content'
                }}
            >
                <Button
                    variant="filledTonal"
                    size="small"
                    width='50%'
                    sx={{
                        paddingLeft: '50px',
                        paddingRight: '50px'
                    }}
                    disabled={collectionButton}
                    startIcon={
                        <CollectionsBookmarkRounded />
                    }
                >
                    Создать коллекцию
                </Button>
            </Container>

            <Container
                className='recommendedBox'
                sx={{
                    minHeight: 'fit-content',
                    maxHeight: 550,
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }}
            >
                <ImageList
                    cols={3}
                    rowHeight={'auto'}
                    sx={{
                        width: "102%",
                        minHeight: "100%"
                    }}
                >
                    {userPosts && userPosts?.map((item) => (
                        <ImageListItem
                            key={item?._id}
                            sx={{
                                overflowX: 'hidden',
                            }}
                        >
                            {/* чекбокс для добавления поста в коллекцию */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!!checkedItems[item?._id]}
                                        onChange={() => handleCheckboxChange(item?._id)}
                                        size="small"
                                        sx={iconStyle}
                                    />
                                }
                            />

                            {/* пост в ленте */}
                            <Box
                                sx={{
                                    width: '100%',
                                    paddingTop: '100%',
                                    backgroundSize: 'cover',
                                    backgroundColor: 'black',
                                    backgroundImage: `url(/images/noPhoto.png)`,
                                    backgroundRepeat: 'no-repeat',
                                }}
                                style={item?.images && (
                                    item?.images[0]?.url &&
                                    { backgroundImage: `url(${url + item?.images[0]?.url})` }
                                )}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Container>
        </Stack>
    )
}