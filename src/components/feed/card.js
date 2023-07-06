import { url } from '../../App';

import React, {
    useState,
    useEffect,
    useContext
} from 'react';

import {
    useDispatch,
    useSelector
} from "react-redux";
import { useHistory } from 'react-router-dom';

import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Avatar,
    IconButton,
    Typography,
    Box,
    Divider,
    Popover,
    Tooltip,
    Checkbox
} from '@mui/material'

import Grid from '@mui/material/Unstable_Grid2';

import PopupState, {
    bindTrigger,
    bindPopover
} from 'material-ui-popup-state';

import {
    FavoriteBorderRounded,
    FavoriteRounded,
    ChatBubbleOutline,
    TurnedInNot,
    SendRounded
} from '@mui/icons-material/'

import {
    actionFullAddLike,
    actionFullDeleteLike
} from "../../redux/thunks";

import { MyCarousel } from './carousel';
import { createDate } from '../functions';
import { ModalForCountsContext } from '../../App';


export function CardFeed({ postData }) {
    const history = useHistory()
    const dispatch = useDispatch()

    // создание ссылки "поделиться"
    const [toolTipText, setToolTipText] = useState(true)
    let text = toolTipText ? 'Нажмите для копирования' : 'Ссылка скопирована в буфер обмена'

    function copyShareLink() {
        // копируем текущий урл сайта и добавляем ид поста
        navigator.clipboard.writeText(window.location.href + `post/${postData?._id}`)

        // меняем текст тултипа и через 2сек возрващаем на место
        setToolTipText(!toolTipText)
        setTimeout(() => setToolTipText(toolTipText), 2000)
    }

    // определяем мой ид
    const myId = useSelector(state => state?.auth?.payload?.sub?.id)

    // картинка лайка включить/отключить
    let isLike = false
    const [checked, setChecked] = useState(isLike)

    const handleChange = (event) => {
        setChecked(event.target.checked)
    }

    // перебираем список всех лайков и сравниваем с моим ид
    let likeId = ''
    postData?.likes?.some(item => {
        if (item?.owner?._id === myId) {
            isLike = true
            likeId = item._id

            return true
        }
    })

    useEffect(() => setChecked(isLike), [isLike])

    function likeAction() {
        checked
            ? dispatch(actionFullDeleteLike({ _id: likeId }))
            : dispatch(actionFullAddLike({ post: { _id: postData?._id } }))
    }

    // контекст модального окна
    const [modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal] = useContext(ModalForCountsContext)

    function toUser() {
        history.push(`/user/${postData?.owner?._id}`)
    }

    function toPost() {
        history.push(`/post/${postData?._id}`)
    }


    return (
        <Card
            className='container-card'
            sx={{
                // width: 550
            }}>
            <CardHeader
                sx={{
                    padding: '8px'
                }}

                avatar={
                    <Avatar
                        sx={{
                            width: 50,
                            height: 50
                        }}
                        alt={postData?.owner?.login}
                        src={url + postData?.owner?.avatar?.url}
                    />
                }

                // троеточие в хедере - нужно подумать, стоит ли его добавлять и что я ним буду делать
                // action={
                //     <IconButton aria-label='settings'>
                //         <MoreVert />
                //     </IconButton>
                // }

                title={
                    <Typography
                        className='cursor-pointer'
                        variant='subtitle1'
                        onClick={toUser}
                        sx={{
                            width: 'fit-content'
                        }}
                    >
                        {postData?.owner?.login}
                    </Typography>
                }

                subheader={
                    createDate(+postData?.createdAt)
                }
            />

            <CardMedia>
                <MyCarousel
                    images={postData?.images}
                />
            </CardMedia>

            <CardActions
                disableSpacing
                sx={{
                    padding: '0 8px'
                }}
            >
                <Box
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                    >
                        <Grid
                            className='container-card-actions'
                            xs={12}
                            container
                            justifyContent='space-between'
                            alignItems='center'
                            flexDirection={{
                                xs: 'column',
                                sm: 'row'
                            }}
                            sx={{
                                fontSize: '12px'
                            }}
                        >
                            <Grid
                                container
                                columnSpacing={1}
                                sx={{
                                    marginLeft: '-21px'
                                }}
                            >
                                {/* Лайк */}
                                <Grid>
                                    <Checkbox
                                        checked={checked}
                                        onChange={handleChange}
                                        inputProps={{
                                            'aria-label': 'controlled'
                                        }}
                                        icon={<FavoriteBorderRounded />}
                                        checkedIcon={<FavoriteRounded />}
                                        onClick={likeAction}
                                        sx={{
                                            '&.Mui-checked': {
                                                color: 'red',
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Коммент */}
                                <Grid>
                                    <IconButton
                                        onClick={toPost}
                                    >
                                        <ChatBubbleOutline />
                                    </IconButton>
                                </Grid>

                                {/* Расшаривание */}
                                <Grid>
                                    <PopupState
                                        variant="popover"
                                        popupId="demo-popup-popover"
                                    >
                                        {(popupState) => (
                                            <React.Fragment>
                                                <IconButton
                                                    aria-label="share"
                                                    {...bindTrigger(popupState)}
                                                >
                                                    <SendRounded
                                                        sx={{ transform: 'translate(3px, -4px) rotate(-30deg)' }}
                                                    />
                                                </IconButton>

                                                <Popover
                                                    {...bindPopover(popupState)}
                                                    anchorOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'left',
                                                    }}
                                                >
                                                    <Tooltip
                                                        title={text}
                                                        placement='bottom-start'
                                                    >
                                                        <Typography
                                                            sx={{ p: 2 }}
                                                            onClick={copyShareLink}
                                                        >
                                                            {window.location.href + `post/${postData?._id}`}
                                                        </Typography>
                                                    </Tooltip>
                                                </Popover>
                                            </React.Fragment>
                                        )}
                                    </PopupState>
                                </Grid>
                            </Grid>

                            {/* Добавление в изобранное */}
                            {/* <Grid>
                                <IconButton>
                                    <TurnedInNot />
                                </IconButton>
                            </Grid> */}
                        </Grid>
                    </Grid>
                </Box>
            </CardActions>

            <CardContent
                sx={{
                    padding: '8px',
                    paddingTop: '0'
                }}
            >
                <Typography
                    className='cursor-pointer'
                    variant='subtitle2'
                    onClick={() => handleOpenModal({ arr: postData?.likes, name: 'Отметки "Нравится"' })}
                    sx={{
                        width: 'fit-content'
                    }}
                >
                    {postData?.likes?.length || '0'} отметок "Нравится"
                </Typography>
            </CardContent>

            <CardContent
                className='tytyty'
                sx={{
                    padding: '8px',
                    paddingTop: '0'
                }}
            >
                <Typography
                    variant='body1'
                    color='text.primary'
                >
                    {postData?.title}
                </Typography>

                <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                        display: 'block',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        width: '400px'
                    }}
                >
                    {postData?.text}

                </Typography>
            </CardContent>

            <CardActions
                sx={{
                    padding: '8px',
                    paddingTop: '0'
                }}
            >
                <Typography
                    className='cursor-pointer'
                    variant='subtitle2'
                    color='text.secondary'
                    onClick={toPost}
                >
                    Посмотреть пост и комментарии к нему ({postData?.comments?.length || '0'})
                </Typography>
            </CardActions>
            <Divider />
        </Card >
    )
}