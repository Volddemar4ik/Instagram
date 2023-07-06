import { url } from "../../App";

import {
    useState,
    useEffect,
    useContext
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import { useHistory } from "react-router-dom";

import {
    Avatar,
    Typography,
    Divider,
    Checkbox
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';

import {
    FavoriteBorderRounded,
    FavoriteRounded
} from '@mui/icons-material/'

import { ModalForCountsContext } from "../../App";

import {
    actionFullAddLike,
    actionFullDeleteLike
} from "../../redux/thunks";

import { CommentContext } from "./comments";

import { createDate } from "../functions";

import './style.scss'


function CommentCard({ data }) {
    const history = useHistory()
    const dispatch = useDispatch()

    // контекст поля ввода комментария
    const [comment, setComment] = useContext(CommentContext)

    // контекст модального окна
    const [modalName, setModalName, modalArray, setModalArray, openModal, setOpenModal, handleOpenModal, handleCloseModal] = useContext(ModalForCountsContext)

    // отслеживаем скрываем/открываем вложенные комментарии
    const [openComments, setOpenComments] = useState(`Показать ответы (${data?.answers.length})`)

    // скрываем/открываем блок с ответами на комментарии
    const [toggleAnswerToBlock, setToggleAnswerToBlock] = useState(false)

    // функция скрытия/открытия ответов на комменты
    async function toggleBlock() {
        setToggleAnswerToBlock(!toggleAnswerToBlock)

        return (openComments === (`Показать ответы (${data?.answers.length})`)
            ? setOpenComments(`Скрыть ответы (${data?.answers.length})`)
            : setOpenComments(`Показать ответы (${data?.answers.length})`)
        )
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
    data?.likes?.some(item => {
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
            : dispatch(actionFullAddLike({ comment: { _id: data?._id } }))
    }


    // функция перевода фокуса в поле комментария при ответе на комментарий
    function addCommentFocus() {
        const inputField = document.getElementById('addCommentField')

        // ставим фокус на поле добавления комментариев
        inputField.focus()

        // добавляем ник, кому будем отвечать, в поле комментариев с припиской "@" и добавляем параметр answerTo для запроса на бек
        setComment({ ...comment, text: `@${data?.owner?.login} `, answerTo: { _id: data._id } })
    }

    // функция перехода на страницу профиля
    function toAccount(id) {
        history.push(`/user/${id}`)
    }


    return (
        <Grid
            container
            spacing={2}
            sx={{
                marginBottom: 2
            }}
        >
            <Grid
                xs={1.5}
                sx={{
                    flex: '0 0 45px'
                }}
            >
                <Avatar
                    alt={data?.owner?.login}
                    src={(url + data?.owner?.avatar?.url)}
                    sx={{
                        width: 40,
                        height: 40
                    }}
                />
            </Grid>

            <Grid
                xs={10.5}
                container
            >
                <Grid
                    xs={10}
                    sx={{
                        paddingBottom: 0
                    }}
                >
                    <Typography
                        className="cursor-pointer"
                        variant="subtitle2"
                        color="text.secondary"
                        onClick={() => toAccount(data?.owner?._id)}
                    >
                        {data?.owner?.login}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {data?.text}
                    </Typography>
                </Grid>

                <Grid
                    xs={2}
                    sx={{
                        paddingBottom: 0
                    }}
                >
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

                <Grid
                    xs={5.5}
                    sx={{
                        padding: 0,
                        paddingLeft: 1
                    }}
                >
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        align='left'
                    >
                        {createDate(+data?.createdAt)}
                    </Typography>
                </Grid>

                <Grid
                    xs={3.5}
                    sx={{
                        padding: 0
                    }}
                >
                    <Typography
                        className="cursor-pointer"
                        variant="caption"
                        color="text.disabled"
                        align='left'
                        onClick={() => handleOpenModal({ arr: data?.likes, name: 'Отметки "Нравится"' })}
                    >
                        Нравится: {data?.likes?.length || '0'}
                    </Typography>
                </Grid>

                <Grid
                    xs={3}
                    sx={{
                        padding: 0,
                        paddingRight: 1
                    }}
                >
                    <Typography
                        className="cursor-pointer"
                        variant="caption"
                        color="text.disabled"
                        align='left'
                        onClick={addCommentFocus}
                    >
                        Ответить
                    </Typography>
                </Grid>

                <Grid
                    xs={12}
                    sx={{
                        padding: '0 8px'
                    }}
                >
                    {(data?.answers.length !== 0) &&
                        <Divider>
                            <Typography
                                className="cursor-pointer"
                                variant="caption"
                                color="text.disabled"
                                onClick={() => toggleBlock(data?._id)}
                            >
                                {openComments}
                            </Typography>
                        </Divider>}
                </Grid>

                {toggleAnswerToBlock &&
                    <Grid xs={12}
                        sx={{
                            padding: '0 8px'
                        }}
                    >
                        {data?.answers && (data?.answers)?.map(item => <CommentCard
                            data={item}
                            key={item._id}
                        />)}
                    </Grid>}
            </Grid>
        </Grid >
    )
}

export default CommentCard