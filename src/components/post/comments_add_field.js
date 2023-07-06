import React, { useState, useContext } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import {
    IconButton,
    Box,
    TextField,
    Popover
} from '@mui/material'
import Button from '@mui/material-next/Button';

import { SentimentSatisfiedAlt } from '@mui/icons-material/'

import EmojiPicker from 'emoji-picker-react';

import { actionFullAddComment } from "../../redux/thunks";

import { CommentContext } from "./comments";

import './style.scss'


function CommentField() {
    const { postId } = useParams()
    const dispatch = useDispatch()

    // контекст для изменения поля добавления комментария
    const [comment, setComment] = useContext(CommentContext)

    // открытие поповера emoji
    const [openPopover, setOpenPopover] = useState(null);
    const openEmoji = (event) => {
        setOpenPopover(event.currentTarget);
    }
    const closeEmoji = () => {
        setOpenPopover(null);
    }
    const open = Boolean(openPopover);
    const emojiField = open ? 'simple-popover' : undefined;

    // отслеживаем все комментарии для проверки имени пользователя в поле комментария при ответе на комментарий
    const allComments = useSelector(state => state?.promise?.FindComments?.payload)

    // запрос на создание комментария
    function uploadComment() {
        // проверка на то, осталось ли в поле вводе комментария логин пользователя, которому нужно ответить. если нет, тогда удаляем из объекта ключ answerTo и диспатчим запрос с именем CreateComment, потому что это уже коммент к посту
        const idToFind = comment?.answerTo?._id
        const findLogin = allComments.find(user => user?._id === idToFind)

        let isInclude
        (comment.text).includes(findLogin?.owner?.login) && (isInclude = true)

        // удаляем ключ answerTo, если нет в строке ввода комментария логина
        if (!isInclude) {
            delete comment.answerTo
        }

        // определяем, какое имя дать запросу
        let nameOfPromise = (isInclude && ('answerTo' in comment)) ? 'CreateCommentTo' : 'CreateComment'

        // отправляем запрос на создание комментария с нужным именем и параметрами
        dispatch(actionFullAddComment(nameOfPromise, comment, postId))

        // и чистим поле ввода комментария после отправки запроса
        setComment({ ...comment, text: '' })
    }


    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                width: '100%'
            }}
        >
            <TextField
                id='addCommentField'
                variant="standard"
                multiline
                placeholder='Комментировать...'
                size="small"
                color="info"
                value={comment.text}
                onChange={e => setComment({ ...comment, text: e.target.value })}
                sx={{
                    margin: 1,
                    width: '100%',
                }}
                InputProps={{
                    startAdornment:
                        <React.Fragment>
                            <IconButton
                                aria-describedby={emojiField}
                                onClick={openEmoji}
                            >
                                <SentimentSatisfiedAlt
                                    fontSize='small'
                                />
                            </IconButton>

                            <Popover
                                id={emojiField}
                                open={open}
                                anchorEl={openPopover}
                                onClose={closeEmoji}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <EmojiPicker
                                    searchPlaceHolder='Найти'
                                    emojiStyle='apple'
                                    width={300}
                                    height={450}
                                    onEmojiClick={
                                        e => setComment({ ...comment, text: comment.text + e.emoji })
                                    }
                                />
                            </Popover>
                        </React.Fragment>,
                    endAdornment:
                        <Box
                            onClick={uploadComment}
                        >
                            {comment.text !== '' &&
                                <Button
                                    className="cursor-pointer"
                                    size="medium"
                                    align='center' sx={{
                                        alignSelf: 'center',
                                        marginLeft: '8px',
                                        padding: '2px 5px'
                                    }}
                                >
                                    отправить
                                </Button>
                            }
                        </Box>
                }}
            />
        </Box>
    )
}

export default CommentField