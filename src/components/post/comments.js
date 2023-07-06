import { url } from "../../App";

import React, { createContext, useState, useContext, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
    useHistory,
    useParams
} from "react-router-dom";

import './style.scss'

import {
    Card,
    CardHeader,
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

import {
    FavoriteBorderRounded,
    FavoriteRounded,
    SendRounded,
    ChatBubbleOutline,
    TurnedInNot,
} from '@mui/icons-material/'
import Grid from '@mui/material/Unstable_Grid2';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

import {
    actionFullAddLike,
    actionFullDeleteLike
} from "../../redux/thunks";

import {
    ModalForCountsContext,
    UpdateProfile
} from "../../App";

import CCommentsFeed from "./comments_feed";
import CommentField from "./comments_add_field";
import ModalWindow from "../structure/modal";

import { createDate } from "../functions";

// контекст для управления состоянием данных для отправки комментов
export const CommentContext = createContext()


export function CardPost({ postData }) {
    const history = useHistory()
    const { postId } = useParams()
    const dispatch = useDispatch()

    // отслеживаем состояние поля ввода комментария для поста
    const [comment, setComment] = useState({ text: '', post: { _id: postId } })

    // контекст модального окна
    const [modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal] = useContext(ModalForCountsContext)

    // контекст обновления профиля
    // const [updateProfile, setUpdateProfile] = useContext(UpdateProfile)

    // перевод фокуса на строку добавления комментария при клике на иконку комментария
    function addCommentFocus() {
        document.getElementById('addCommentField').focus()
    }

    // отслеживание состояния текста для ToolTips "поделиться ссылкой"
    const [toolTipText, setToolTipText] = useState(true)
    let text = toolTipText ? 'Нажмите для копирования' : 'Ссылка скопирована в буфер обмена'

    // функция копирования ссылки на пост
    function copyShareLink() {
        // получаем урл текущей страницы
        const postUrl = window.location.href
        // копируем полученный урл в буфер
        navigator.clipboard.writeText(postUrl)

        // меняем текст тултипа и через 2сек возрващаем на место
        setToolTipText(!toolTipText)
        setTimeout(() => setToolTipText(toolTipText), 2000)
    }


    // функция отображения лайка
    // чекаем мой ид
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

    // функция отображения людей, которым понравился пост
    function showLikesOwner() {
        handleOpenModal({ arr: postData?.likes, name: 'Отметки "Нравится"' })
    }

    // Переход на профиль пользователя
    function toAccount() {
        history.push(`/user/${postData?.owner?._id}`)
    }

    return (
        <CommentContext.Provider value={[comment, setComment]}>
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '80vh',
                    borderRadius: 0,
                    height: '100%',
                    maxHeight: 450,
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            alt={postData?.owner?.login}
                            src={(url + postData?.owner?.avatar?.url)}
                            sx={{
                                width: 50,
                                height: 50
                            }}
                        />
                    }

                    title={
                        <Typography
                            className="cursor-pointer"
                            onClick={toAccount}
                        >
                            {postData?.owner?.login}
                        </Typography>
                    }

                    subheader={createDate(+postData?.createdAt)}
                />

                <Divider />

                <CardContent
                    className='post-comments'

                    sx={{
                        flex: '1 1 auto',
                        overflowY: 'auto',
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        sx={{
                            marginBottom: 3
                        }}
                    >
                        <Grid
                            xs={2}
                            sx={{
                                flex: '0 0 45px'
                            }}
                        >
                            <Avatar
                                alt={postData?.owner?.login}
                                src={(url + postData?.owner?.avatar?.url)}
                                sx={{
                                    width: 40,
                                    height: 40
                                }}
                            />
                        </Grid>

                        <Grid
                            xs={10}
                        >
                            <Typography
                                className="cursor-pointer"
                                variant="subtitle2"
                                color="text.secondary"
                                onClick={toAccount}
                                sx={{
                                    width: 'fit-content'
                                }}
                            >
                                {postData?.owner?.login}
                            </Typography>

                            <Typography
                                variant="subtitle2"
                                color="text.primary"
                            >
                                {postData?.title}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {postData?.text}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid>
                        <CCommentsFeed />
                    </Grid>
                </CardContent>

                <Divider />

                <React.Fragment>
                    <CardActions
                        disableSpacing
                    >
                        <Box
                            sx={{
                                flexGrow: 1
                            }}>
                            <Grid
                                xs={12}
                                container
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    fontSize: '12px'
                                }}
                            >
                                <Grid
                                    container
                                >
                                    <Grid>
                                        <Checkbox
                                            checked={checked}
                                            onChange={handleChange}
                                            inputProps={{ 'aria-label': 'controlled' }}
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

                                    <Grid>
                                        <IconButton
                                            onClick={addCommentFocus}
                                        >
                                            <ChatBubbleOutline />
                                        </IconButton>
                                    </Grid>

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
                                                                {window.location.href}
                                                            </Typography>
                                                        </Tooltip>
                                                    </Popover>
                                                </React.Fragment>
                                            )}
                                        </PopupState>
                                    </Grid>
                                </Grid>

                                {/* <Grid>
                                    <IconButton>
                                        <TurnedInNot />
                                    </IconButton>
                                </Grid> */}
                            </Grid>

                            <Grid
                                container
                            >
                                <Typography
                                    className="cursor-pointer"
                                    variant="subtitle1"
                                    color="text.secondary"
                                    onClick={showLikesOwner}
                                    sx={{
                                        padding: 1,
                                    }}
                                >
                                    Нравится: {postData?.likes?.length || '0'}
                                </Typography>
                            </Grid>
                        </Box>

                        {modalArray && <ModalWindow />}
                    </CardActions>

                    <Divider />

                    <CardActions>
                        <CommentField />
                    </CardActions>
                </React.Fragment>
            </Card>
        </CommentContext.Provider >
    )
}