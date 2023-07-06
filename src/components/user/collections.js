import { url } from '../../App';

import React, { createContext, useEffect, useState } from 'react';
import {
    List,
    ListItem,
    Divider,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    IconButton,
    Backdrop,
    Box,
    Modal,
    Fade,
    Button,
    Stack
} from '@mui/material'

import {
    AddRounded,
    CloseRounded
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';



import {
    actionFullFindCollections
    , actionFullFinCollectionOne
} from '../../redux/thunks';

import { actionFeedFindOne } from '../../redux/action';

import ModalCarousel from './collections_card';
import CreateCollection from './collections_create';

export const CollectionContext = createContext()


// стили модального окна карусели коллекции
const styleModal = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '400px',
    width: '50%',
    // width: '100%',
    minHeigth: '500px',
    height: '80%',
    bgcolor: '#FFF',
    // p: 2,
    bgcolor: 'background.paper',
    // boxShadow: 24,
    outline: 0,
    borderRadius: 3,
    padding: '5px 0'
}

// стили модального окна создания коллекции
const styleCreate = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    maxWidth: '500px',
    maxHeight: '80%',
    bgcolor: '#FFF',
    p: 2,
    bgcolor: 'background.paper',
    boxShadow: 24,
    outline: 0,
    borderRadius: 3,
    padding: '5px 0'
};






export default function Collections({ userData }) {
    // console.log('userData: ', userData)

    // const history = useHistory()
    const dispatch = useDispatch()

    // отслеживаю мой ид
    const myId = useSelector(state => state?.auth?.payload?.sub?.id)

    // запуск загрузки всех коллекций юзера при изменении ид
    useEffect(() => {
        dispatch(actionFullFindCollections(userData))
    }, [userData])

    // подписываемся на загрузку коллекций
    const allCollections = useSelector(state => state?.collection?.FindCollections?.payload)
    console.log('allCollections: ', allCollections)

    // управление модальным окном коллекции
    const [openCarousel, setOpenCarousel] = useState(false)
    const handleOpenCarousel = () => setOpenCarousel(true)
    const handleCloseCarousel = () => setOpenCarousel(false)


    // управление модальным окном создания коллекции
    const [openCreateCollection, setOpenCreateCollection] = useState(false)
    const handleOpenCreateCollection = () => {
        dispatch(actionFeedFindOne([myId], -1, 100, 'PostListCollection', 'COLLECTIONS', 0)).then(res => {
            if (res) setOpenCreateCollection(true)
        })

    }
    const handleCloseCreateCollection = () => setOpenCreateCollection(false)

    // отслеживание названия коллекции
    const [collectionName, setCollectionName] = useState('')

    function openCollection(id) {
        dispatch(actionFullFinCollectionOne(id)).then(res => {
            res && handleOpenCarousel()
            setCollectionName(res?.text)
        })
    }

    // горизонтальный скорлл на коллекциях
    const horizontalScroll = document.getElementById('collection-horizontal-scroll')
    if (horizontalScroll) {
        horizontalScroll.addEventListener('wheel', function (event) {
            if (event.deltaMode == event.DOM_DELTA_PIXEL) {
                var modifier = 1;
                // иные режимы возможны в Firefox
            } else if (event.deltaMode == event.DOM_DELTA_LINE) {
                var modifier = parseInt(getComputedStyle(this).lineHeight)
            } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
                var modifier = this.clientHeight
            }
            if (event.deltaY != 0) {
                // замена вертикальной прокрутки горизонтальной
                this.scrollLeft += modifier * event.deltaY
                event.preventDefault()
            }
        })
    }


    return (
        <CollectionContext.Provider value={[openCreateCollection, setOpenCreateCollection]}>
            <React.Fragment>
                <List
                    // className='collection-scroll'
                    id='collection-horizontal-scroll'
                    sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'row',
                        overflowX: 'hidden'
                    }}
                >
                    {/* иконка создания коллекций */}
                    {userData === myId &&
                        <ListItem
                            alignItems="flex-start"
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 'fit-content'
                            }}
                        >
                            <ListItemAvatar
                                className='cursor-pointer'
                                onClick={handleOpenCreateCollection}
                            >
                                <Avatar sx={{ width: 100, height: 100 }}>
                                    <AddRounded
                                        fontSize='large'
                                        sx={{ color: '#FFF' }}
                                    />
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'center',
                                    width: 90
                                }}
                                primary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Новая коллекция
                                    </Typography>
                                }
                            />

                            <Modal
                                aria-labelledby="modal-collection"
                                aria-describedby="modal-collection"
                                open={openCreateCollection}
                                onClose={handleCloseCreateCollection}
                                closeAfterTransition
                                slots={{ backdrop: Backdrop }}
                                slotProps={{
                                    backdrop: {
                                        timeout: 500,
                                    },
                                }}
                            >
                                <Fade in={openCreateCollection}>
                                    <Box sx={styleCreate}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{
                                                padding: '0 24px'
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                color='text.primary'
                                                textAlign='center'
                                                gutterBottom
                                            >
                                                Создание коллекции
                                            </Typography>

                                            <IconButton
                                                onClick={handleCloseCreateCollection}
                                                sx={{
                                                    position: 'absolute',
                                                    top: '0px',
                                                    right: '0px',
                                                    fontSize: '25px',
                                                    cursor: 'default'
                                                }}
                                            >
                                                <CloseRounded className='cursor-pointer' />
                                            </IconButton>
                                        </Stack>

                                        <Divider />

                                        <CreateCollection />
                                    </Box>
                                </Fade>
                            </Modal>
                        </ListItem>}

                    {/* список всех коллекций пользователя */}
                    {(allCollections?.length > 0) && allCollections?.map(item =>
                        <ListItem
                            alignItems="flex-start"
                            key={item?._id}
                            title={item?.text}
                            sx={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                width: 'fit-content'
                            }}
                        >
                            {item?.posts && <ListItemAvatar>
                                <Avatar
                                    className='cursor-pointer'
                                    alt={item?.text}
                                    src={url + item?.posts[0]?.images[0]?.url}
                                    onClick={() => openCollection(item?._id)}
                                    sx={{ width: 100, height: 100 }}
                                />
                            </ListItemAvatar>}

                            <ListItemText
                                sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    textAlign: 'center',
                                    width: 90
                                }}
                                primary={
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {item?.text}
                                    </Typography>
                                }
                            />

                            <Modal
                                aria-labelledby="modal-collection"
                                aria-describedby="modal-collection"
                                open={openCarousel}
                                onClose={handleCloseCarousel}
                                closeAfterTransition
                                slots={{ backdrop: Backdrop }}
                                slotProps={{
                                    backdrop: {
                                        timeout: 500,
                                    },
                                }}
                            >
                                <Fade in={openCarousel}>
                                    <Box sx={styleModal}>
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            sx={{
                                                padding: '0 24px'
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                color='text.primary'
                                                textAlign='center'
                                                gutterBottom
                                            >
                                                {/* Коллекция... */}
                                                {collectionName}
                                            </Typography>

                                            <IconButton
                                                onClick={handleCloseCarousel}
                                                sx={{
                                                    position: 'absolute',
                                                    top: '0px',
                                                    right: '0px',
                                                    fontSize: '25px',
                                                    cursor: 'default'
                                                }}
                                            >
                                                <CloseRounded className='cursor-pointer' />
                                            </IconButton>
                                        </Stack>

                                        <Divider />

                                        <ModalCarousel />
                                    </Box>
                                </Fade>
                            </Modal>
                        </ListItem>
                    )}
                </List>

                {(userData === myId || allCollections?.length > 0) && <Divider sx={{ marginTop: 1 }} />}
            </React.Fragment>
        </CollectionContext.Provider>
    )
}