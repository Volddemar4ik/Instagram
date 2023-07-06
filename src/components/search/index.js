import { url } from "../../App";

import React, { useEffect, useState } from "react"

import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";

import {
    Box,
    Typography,
    Avatar,
    Stack,
    InputBase,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    CircularProgress
} from '@mui/material';
import Button from '@mui/material-next/Button';

import {
    SearchRounded,
    TouchAppRounded
} from '@mui/icons-material';

import { actionFullSearch } from "../../redux/thunks";

import './style.scss'

export default function Search() {
    const dispatch = useDispatch()

    const searchUserLogin = useSelector(state => state?.search?.userLogin?.payload)
    const searchUserNick = useSelector(state => state?.search?.userNick?.payload)
    const searchPostTitle = useSelector(state => state?.search?.postTitle?.payload)
    const searchPostText = useSelector(state => state?.search?.postText?.payload)
    const searchCommenttext = useSelector(state => state?.search?.commetText?.payload)

    const searchUserLoginStatus = useSelector(state => state?.search?.userLogin?.status)
    const searchUserNickStatus = useSelector(state => state?.search?.userNick?.status)
    const searchPostTitleStatus = useSelector(state => state?.search?.postTitle?.status)
    const searchPostTextStatus = useSelector(state => state?.search?.postText?.status)
    const searchCommenttextStatus = useSelector(state => state?.search?.commetText?.status)

    // отслеживаем статус загрузки всех промисов
    const [downloadStatus, setDownloadStatus] = useState(true)

    useEffect(() => {
        setDownloadStatus(
            (searchUserLoginStatus === 'FULFILLED') &&
            (searchUserNickStatus === 'FULFILLED') &&
            (searchPostTitleStatus === 'FULFILLED') &&
            (searchPostTextStatus === 'FULFILLED') &&
            (searchCommenttextStatus === 'FULFILLED')
        )
    },
        [searchUserLoginStatus, searchUserNickStatus, searchPostTitleStatus, searchPostTextStatus, searchCommenttextStatus])

    // собираем все в один массив после завершения поиска
    const [fullSearchData, setFullSearchData] = useState([])

    useEffect(() => {
        setFullSearchData((searchUserLogin && searchUserNick && searchPostTitle && searchPostText && searchCommenttext) && [...new Map([...searchUserLogin, ...searchUserNick, ...searchPostTitle, ...searchPostText, ...searchCommenttext]?.map(item => [item?._id, item])).values()])
    },
        [searchUserLogin, searchUserNick, searchPostTitle, searchPostText, searchCommenttext])

    // отслеживание текста в поле ввода поиска
    const [inputText, setInputText] = useState('')

    // отслеживаем, запустили поиск или нет
    const [searching, setSearching] = useState(false);

    // функция вызова поиска
    const onSearch = () => {
        if (searching) {
            return
        }

        setSearching(true)

        const newData = new RegExp(inputText.split(' ').join('|')).toString()

        dispatch(actionFullSearch(newData)).finally(() => {
            setSearching(false)
            setInputText('')
        })
    }


    return (
        <Box
            sx={{
                padding: '16px',
                width: '80%',
                margin: '0 auto',
            }}
        >
            <Stack
                spacing={2}
            >
                <Box
                    sx={{
                        border: '1px solid #E8E8E8',
                        borderRadius: '8px',
                        padding: '8px'
                    }}
                >
                    <InputBase
                        fullWidth={true}
                        placeholder="Найти..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => {
                            if (e.code === 'Enter') {
                                e.preventDefault()
                                onSearch()
                            }
                        }}
                        inputProps={{
                            'aria-label': 'Найти...',
                        }}
                        sx={{
                            ml: 1, flex: 1
                        }}
                        startAdornment={
                            <SearchRounded position="start" />
                        }
                        endAdornment={
                            <Typography
                                className="cursor-pointer"
                                variant='subtitle2'
                                align='right'
                                color='primary.main'
                                sx={{
                                    alignSelf: 'center',
                                    margin: '0 8px',
                                    fontWeight: '700'
                                }}
                            >
                                {inputText !== '' &&
                                    <Box
                                        onClick={onSearch}
                                    >
                                        <Button
                                            startIcon={<TouchAppRounded />}
                                            color="primary"
                                            size="small"
                                            variant="filledTonal"
                                            sx={{
                                                padding: '5px 10px'
                                            }}
                                        >
                                            Искать
                                        </Button>
                                    </Box>
                                }
                            </Typography>
                        }
                    />
                </Box>

                {!downloadStatus &&
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="20vh"
                    >
                        <CircularProgress />
                    </Box>
                }

                <React.Fragment>
                    <List className="search-list-container">
                        {fullSearchData && fullSearchData?.map(item => <SearchCard data={item} key={item?._id} />)}
                    </List>
                </React.Fragment>
            </Stack >

            {fullSearchData && fullSearchData?.length === 0 &&
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    color='text.primary'
                    align='center'
                >
                    К сожалению, нам не удалось ничего найти по этому запросу.
                </Typography>}
        </Box>
    )
}

function SearchCard({ data }) {
    const history = useHistory()

    function toPost() {
        if (data?.post) {
            history.push(`/post/${data?.post?._id}`)
        } else {
            history.push(`/post/${data?._id}`)
        }
    }

    function toUser() {
        history.push(`/user/${data?.owner ? data?.owner?._id : data?._id}`)
    }


    return (
        <Paper
            elevation={3}
            sx={{
                padding: '8px',
                marginTop: '10px'
            }}
        >
            <ListItem
                className="cursor-pointer"
                alignItems="flex-start"
                onClick={toUser}
                sx={{
                    width: '100%',
                    padding: '0 16px'
                }}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={data?.owner ? data?.owner?.login : data?.login}
                        src={url + (data?.owner ? data?.owner?.avatar?.url : data?.avatar?.url)} />
                </ListItemAvatar>

                <ListItemText
                    primary={data?.owner ? data?.owner?.login : data?.login}
                    secondary={
                        <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{
                                display: 'inline'
                            }}
                        >
                            {data?.owner ? data?.owner?.nick : data?.nick}
                        </Typography>
                    }
                />
            </ListItem>

            {data?.owner &&
                <ListItem
                    className="cursor-pointer"
                    onClick={toPost}
                    sx={{
                        border: '1px solid #E8E8E8',
                        borderRadius: '8px',
                        marginTop: '8px',
                    }}
                >
                    <ListItemText
                        primary={data?.title && data?.title}
                        secondary={data?.text &&
                            <React.Fragment>
                                {data?.post &&
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        display="block"
                                    >
                                        Комментарий к посту:
                                    </Typography>
                                }

                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                    sx={{
                                        display: 'inline'
                                    }}
                                >
                                    {data?.text}
                                </Typography>
                            </React.Fragment>
                        }
                    />
                </ListItem>}
        </Paper>
    )
}